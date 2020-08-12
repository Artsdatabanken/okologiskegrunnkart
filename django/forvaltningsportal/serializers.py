from rest_framework import serializers

from .models import Kartlag

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
