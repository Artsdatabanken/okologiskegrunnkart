from django.db.models import Q

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView

from .models import Kartlag, Sublag

from .permissions import IsSuperuser

import requests
import xml.etree.ElementTree as ET

from .serializers import KartlagSerializer, SublagSerializer
import re

# from xml.etree.ElementTree import fromstring, ElementTree

class KartlagAPIView(APIView):
    permission_classes = (IsSuperuser, )

    def get_xml_data(self, url):
        # get the response from the URL
        try:
            response = requests.get(url, stream=True)
            if response.ok:
                tree = ET.ElementTree(ET.fromstring(response.content))
                root = tree.getroot()
                return root
            else:
                return None
        except Exception:
            return None

    def clean_click_text(self, text):
        try:
            found = re.search('{(.+?)}', text).group(1)
            remove = '{' + found + '}'
            rest = text.replace(remove, '')
            split_found = found.split('.')
            if len(split_found) > 0 and split_found[0].isdigit():
                number_remove = split_found[0] + '.'
                clean_found = found.replace(number_remove, '')
            else:
                clean_found = found
            final = '{' + clean_found + '}' + rest
        except Exception:
            final = text
        
        return final


    def get(self, request: Request, *args, **kwargs):
        all_kartlag = Kartlag.objects.all()
        layers_success_request = []
        sublayers_list = []

        for kartlag in all_kartlag:
            url = kartlag.wmsurl
            if url is None:
                continue

            # # Print data to show progress in console
            # print('------------------------------------------')
            # print('Kartlag: ', kartlag)
            # print(url)

            # Add parameters to wmsurl if they are not included
            number_symbol = url.count('?')
            if number_symbol == 0:
                url = url + '?request=GetCapabilities&service=WMS'
                kartlag.wmsurl = url
                kartlag.save()
            elif number_symbol == 1:
                url_list = url.split('?')
                if url_list[1] == '':
                    url = url + 'request=GetCapabilities&service=WMS'
                    kartlag.wmsurl = url
                    kartlag.save()
                elif 'version=' in url_list[1]:
                    url = url_list[0] + '?request=GetCapabilities&service=WMS'
                    kartlag.wmsurl = url
                    kartlag.save()

            root = self.get_xml_data(url)
            if root is None:
                continue

            # Define relevant variables
            projection_list = ['EPSG:3857', 'EPSG:900913'] # EPSG:3857 is preferred for GetFeatureInfo
            if kartlag.projeksjon not in projection_list:
                projection = None
            else:
                projection = kartlag.projeksjon

            format_list = [
                "application/vnd.ogc.gml",
                "application/vnd.ogc.wms_xml",
                "text/xml",
                "application/vnd.esri.wms_featureinfo_xml",
                "application/vnd.esri.wms_raw_xml",
                "application/geojson",
            ]
            if kartlag.wmsinfoformat not in format_list:
                infoformat = None
            else:
                infoformat = kartlag.wmsinfoformat
            
            # Loop over all elements
            extrainfo = ''
            for item in root.iter('*'):
                # Find namespace and use as extrainfo
                hasNamespace = item.tag.count('}') > 0
                if hasNamespace:
                    extrainfo = item.tag.split('}')[0] + '}'

                # Find wms version
                if (item.tag == '{}WMS_Capabilities'.format(extrainfo)
                    or item.tag == '{}WMT_MS_Capabilities'.format(extrainfo)):
                    version = item.get('version')

                    # Add layer to list of layers with successful response
                    layers_success_request.append(kartlag)
                    
                    if version is not None:
                        # Replace if field is empty
                        if not kartlag.wmsversion or kartlag.wmsversion == '':
                            kartlag.wmsversion = version
                            kartlag.save()
                        # Replace if old version is stored and new version is available
                        if kartlag.wmsversion == '1.1.0' and version == '1.3.0':
                            kartlag.wmsversion = version
                            kartlag.save()

                # Find projection
                if (item.tag == '{}CRS'.format(extrainfo)
                    or item.tag == '{}SRS'.format(extrainfo)):
                    if projection is None or projection != projection_list[0]:
                        all_projections = item.text
                        for proj in projection_list:
                            if all_projections is not None and proj in all_projections:
                                projection = proj
                                kartlag.projeksjon = proj
                                kartlag.save()
                                break

                # Find format
                if infoformat is None and item.tag == '{}GetFeatureInfo'.format(extrainfo):
                    all_formats = item.findall('{}Format'.format(extrainfo))
                    # Make list will all available formats in XML
                    available_formats = []
                    for form in all_formats:
                        available_formats.append(form.text)
                    # Select preferred format if this is found in available formats
                    if len(available_formats) > 0:
                        for def_format in format_list:
                            if def_format in available_formats:
                                infoformat = def_format
                                kartlag.wmsinfoformat = def_format
                                kartlag.save()
                                break

                # Get all sublayers
                if item.tag == '{}Layer'.format(extrainfo):
                    queryable_str = item.get('queryable')
                    name = item.find('{}Name'.format(extrainfo))
                    title = item.find('{}Title'.format(extrainfo))
                    if name is not None and title is not None:
                        title = title.text
                        name = name.text

                        # Create list with all sublayers
                        sublayers_list.append(name)

                        if queryable_str == '1':
                            queryable = True
                        else:
                            queryable = False
                        
                        # Get leyend url and add parameters
                        legendeurl = kartlag.wmsurl
                        number_symbol = url.count('?')
                        parameters = '?version={}&service=WMS&request=GetLegendGraphic&layer={}&format=image/png'.format(kartlag.wmsversion, name)
                        if kartlag.wmsversion == '1.3.0':
                            parameters = parameters + '&sld_version=1.1.0'
                        if number_symbol == 0:
                            legendeurl = legendeurl + parameters
                        elif number_symbol == 1:
                            url_list = url.split('?')
                            legendeurl = url_list[0] + parameters

                        # Find if it is a parent layer
                        parent = False
                        first_child = item.find('{}Layer'.format(extrainfo))
                        if first_child is not None:
                            parent = True
                        
                        # Get min zoom limit
                        min_zoom_xml = item.find('{}MinScaleDenominator'.format(extrainfo))
                        min_zoom = None
                        if min_zoom_xml is not None:
                            min_zoom = min_zoom_xml.text
                            try:
                                min_zoom = int(float(min_zoom))
                            except Exception:
                                min_zoom = None
                        # Get first child's min zoom
                        elif min_zoom_xml is None and parent:
                            min_zoom_xml = first_child.find('{}MinScaleDenominator'.format(extrainfo))
                            if min_zoom_xml is not None:
                                min_zoom = min_zoom_xml.text
                                try:
                                    min_zoom = int(float(min_zoom))
                                except Exception:
                                    min_zoom = None

                        # Get max zoom limit
                        max_zoom_xml = item.find('{}MaxScaleDenominator'.format(extrainfo))
                        max_zoom = None
                        if max_zoom_xml is not None:
                            max_zoom = max_zoom_xml.text
                            try:
                                max_zoom = int(float(max_zoom))
                            except Exception:
                                max_zoom = None
                        # Get first child's max zoom
                        elif max_zoom_xml is None and parent:
                            max_zoom_xml = first_child.find('{}MaxScaleDenominator'.format(extrainfo))
                            if max_zoom_xml is not None:
                                max_zoom = max_zoom_xml.text
                                try:
                                    max_zoom = int(float(max_zoom))
                                except Exception:
                                    max_zoom = None


                        # # Print data to show progress in console
                        # print('------------')
                        # print(name)

                        if Sublag.objects.filter(Q(hovedkartlag=kartlag) & Q(wmslayer=name)).exists():
                            queryset = Sublag.objects.filter(Q(hovedkartlag=kartlag) & Q(wmslayer=name))
                            if queryset.count() > 1:
                                for index, lag in enumerate(queryset):
                                    if index > 0:
                                        lag.delete()
                                
                            sublag = Sublag.objects.get(Q(hovedkartlag=kartlag) & Q(wmslayer=name))
                            sublag.queryable = queryable
                            sublag.minscaledenominator = min_zoom
                            sublag.maxscaledenominator = max_zoom
                            if sublag.legendeurl != legendeurl:
                                sublag.legendeurl = legendeurl
                            if sublag.erSynlig:
                                sublag.suggested = True
                                sublag.erSynlig = False

                            # If sublayer click data is empty, copy it from layer
                            if sublag.testkoordinater == '' and kartlag.testkoordinater != '':
                                sublag.testkoordinater = kartlag.testkoordinater
                            if sublag.klikkurl == '' and kartlag.klikkurl != '':
                                sublag.klikkurl = kartlag.klikkurl
                            if sublag.klikktekst == '' and kartlag.klikktekst != '':
                                sublag.klikktekst = self.clean_click_text(kartlag.klikktekst)
                            if sublag.klikktekst2 == '' and kartlag.klikktekst2 != '':
                                sublag.klikktekst2 = self.clean_click_text(kartlag.klikktekst2)
                            
                            sublag.save()
                            
                        else:
                            Sublag.objects.create(
                                wmslayer=name,
                                tittel=title,
                                legendeurl=legendeurl,
                                hovedkartlag=kartlag,
                                queryable=queryable,
                                minscaledenominator=min_zoom,
                                maxscaledenominator=max_zoom,
                                testkoordinater = kartlag.testkoordinater,
                                klikkurl=kartlag.klikkurl,
                                klikktekst=kartlag.klikktekst,
                                klikktekst2=kartlag.klikktekst2
                            )
        
        # Cleanup database. Remove sublayers which are not
        # found in any of the layers capabilities
        sublayers_to_remove = Sublag.objects.filter(hovedkartlag__in=layers_success_request).exclude(wmslayer__in=sublayers_list)
        for sublayer in sublayers_to_remove:
            # print('-------------------------------------------')
            # print('Deleting')
            # print(sublayer)
            # print(sublayer.wmslayer)
            # print('Plublished: ', sublayer.publiser)
            # print('Suggested: ', sublayer.suggested)
            # print('-------------------------------------------')
            sublayer.delete()

        return Response(status=status.HTTP_200_OK)

kartlag_api_view = KartlagAPIView.as_view()


class KartlagUpdateAPIView(UpdateAPIView):
    permission_classes = (IsSuperuser, )
    serializer_class = KartlagSerializer
    queryset = Kartlag.objects.all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

kartlag_update_api_view = KartlagUpdateAPIView.as_view()

class SubtlagUpdateAPIView(UpdateAPIView):
    permission_classes = (IsSuperuser, )
    serializer_class = SublagSerializer
    queryset = Sublag.objects.all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

sublag_update_api_view = SubtlagUpdateAPIView.as_view()
