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
            'wmsinfoformat',
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
            'hovedkartlag',
            'queryable',
            'minscaledenominator',
            'maxscaledenominator',
            'suggested',
            'testkoordinater',
            'klikkurl',
            'klikktekst',
            'klikktekst2',
            'faktaark'
        )
        read_only_fields = (
            'id',
            'tittel',
            'wmslayer',
            'legendeurl',
            'publiser',
            'hovedkartlag',
            'queryable',
            'minscaledenominator',
            'maxscaledenominator'
        )
