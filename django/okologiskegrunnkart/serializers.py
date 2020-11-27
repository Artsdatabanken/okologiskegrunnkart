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
            'dataeier',
            'tema',
            'tag',
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
            'publisertest',
            'publiserprod',
            'hovedkartlag',
            'queryable',
            'minscaledenominator',
            'maxscaledenominator',
            'suggested',
            'testkoordinater',
            'klikkurl',
            'klikktekst',
            'klikktekst2',
            'faktaark',
            'position'
        )
        read_only_fields = (
            'id',
            'tittel',
            'wmslayer',
            'publisertest',
            'publiserprod',
            'hovedkartlag',
            'queryable',
            'minscaledenominator',
            'maxscaledenominator'
        )
