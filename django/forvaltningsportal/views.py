from django.db.models import Q

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Kartlag, Sublag

from .permissions import IsSuperuser

import requests
import xml.etree.ElementTree as ET

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

    def get(self, request: Request, *args, **kwargs):
        all_kartlag = Kartlag.objects.all()

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

            root = self.get_xml_data(url)
            if root is None:
                continue

            # Define relevant variables
            projection_list = ['EPSG:3857', 'EPSG:900913']
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
                    # Replace only if field is empty
                    if version is not None:
                        if not kartlag.wmsversion or kartlag.wmsversion == '':
                            kartlag.wmsversion = version
                            kartlag.save()

                # Find projection
                if projection is None:
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
                        if queryable_str == '1':
                            queryable = True
                        else:
                            queryable = False
                        
                        # Get leyend url and add parameters
                        legendeurl = kartlag.wmsurl
                        number_symbol = url.count('?')
                        parameters = '?version={}&service=WMS&request=GetLegendGraphic&layer={}&format=image/png'.format(kartlag.wmsversion, name)
                        if number_symbol == 0:
                            legendeurl = legendeurl + parameters
                        elif number_symbol == 1:
                            url_list = url.split('?')
                            legendeurl = url_list[0] + parameters

                        # Get min zoom limit
                        min_zoom_xml = item.find('{}MinScaleDenominator'.format(extrainfo))
                        min_zoom = None
                        if min_zoom_xml is not None:
                            min_zoom = min_zoom_xml.text
                            try:
                                min_zoom = int(min_zoom)
                            except Exception:
                                min_zoom = None
                        
                        # Get max zoom limit
                        max_zoom_xml = item.find('{}MaxScaleDenominator'.format(extrainfo))
                        max_zoom = None
                        if max_zoom_xml is not None:
                            max_zoom = max_zoom_xml.text
                            try:
                                max_zoom = int(max_zoom)
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
                            sublag.save()
                            
                        else:
                            Sublag.objects.create(
                                wmslayer=name,
                                tittel=title,
                                legendeurl=legendeurl,
                                hovedkartlag=kartlag,
                                queryable=queryable,
                                minscaledenominator=min_zoom,
                                maxscaledenominator=max_zoom
                            )

        return Response(status=status.HTTP_200_OK)

    # def post(self, request: Request, *args, **kwargs):
    #     # Need to fix CSRF
    #     layers = Kartlag.objects.all()
    #     print(layers)

    #     website = self.get_xml_data()
    #     print(website)
    #     print(website.text)

    #     return Response(status=status.HTTP_200_OK)
        
    # def delete(self, request: Request, facility_id: str, template_id=None, *args, **kwargs):
    #     if not template_id:
    #         # Missing required data
    #         return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    #     template = SafetyTemplate.objects.get(id=template_id)
    #     template.delete()

    #     return Response(status=status.HTTP_202_ACCEPTED)

kartlag_api_view = KartlagAPIView.as_view()

class KartlagOpenAPIView(APIView):
    queryset = Kartlag.objects.all()

    def get(self, request: Request, *args, **kwargs):

        layers = Kartlag.objects.all()

        return Response(status=status.HTTP_200_OK)

kartlag_open_api_view = KartlagOpenAPIView.as_view()