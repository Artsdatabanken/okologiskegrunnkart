from rest_framework import serializers

from .models import Kartlag, Sublag

class KartlagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Kartlag
        fields = (
            'id',
            'tittel',
            'geonorgeurl',
            'faktaark',
            'produktark',
            'dataeier',
            'tema',
            'tag',
            'publiser',
            'wmsurl',
            'wmsversion',
            'projeksjon',
            'testkoordinater',
            'wmsinfoformat',
            'klikkurl',
            'klikktekst',
            'klikktekst2',
            'aggregatedwmslayer',
            'type'
        )
        read_only_fields = (
            'id',
            'tittel',
            'geonorgeurl',
            'produktark',
            'dataeier',
            'tema',
            'tag',
            'publiser',
            'wmsurl',
            'wmsversion',
            'projeksjon',
            'wmsinfoformat',
            'type'
        )

class SublagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Sublag
        fields = (
            'id',
            'tittel',
            'wmslayer',
            'legendeurl',
            'publiser',
            'erSynlig',
            'hovedkartlag',
            'queryable',
            'minscaledenominator',
            'maxscaledenominator',
            'suggested',
            'testkoordinater',
            'klikkurl',
            'klikktekst',
            'klikktekst2'
        )
        read_only_fields = (
            'id',
            'tittel',
            'wmslayer',
            'legendeurl',
            'publiser',
            'erSynlig',
            'hovedkartlag',
            'queryable',
            'minscaledenominator',
            'maxscaledenominator',
            'suggested'
        )
