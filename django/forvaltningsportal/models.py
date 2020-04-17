from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import User
import json

# Antar nå at alle url'er er lange, og at vi får slått sammen alle url-variablene til en variabel.
# ignorerer for øyeblikket de som har felter som skiller seg ut fra resten


class Tema(models.Model):
    tittel = models.CharField(max_length=200)

    def __str__(self):
        return self.tittel


class Tag(models.Model):
    tittel = models.CharField(max_length=200)

    def __str__(self):
        return self.tittel


class Dataeier(models.Model):
    tittel = models.CharField(max_length=200)
    logourl = models.CharField(max_length=500, blank=True)
    url = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return self.tittel


class Type(models.Model):
    tittel = models.CharField(max_length=200)

    def __str__(self):
        return self.tittel


class Kartlag(models.Model):
    tittel = models.CharField(max_length=200)
    wmsurl = models.CharField(max_length=500, blank=True)
    wmslayer = models.CharField(max_length=100, blank=True)
    faktaark = models.CharField(max_length=500, blank=True)
    produktark = models.CharField(max_length=500, blank=True)
    klikkurl = models.CharField(max_length=500, blank=True)
    klikktekst = models.CharField(max_length=500, blank=True)
    geonorgeurl = models.CharField(max_length=500, blank=True)
    legendeurl = models.CharField(max_length=500, blank=True)
    publiser = models.BooleanField(default=False)
    type = models.ForeignKey(
        Type, on_delete=models.SET_NULL, null=True, blank=True)
    dataeier = models.ForeignKey(Dataeier, on_delete=models.CASCADE)
    tema = models.ForeignKey(
        Tema, on_delete=models.SET_NULL, null=True, blank=True)
    tag = models.ManyToManyField(Tag, blank=True)

    def __str__(self):
        return self.tittel


@receiver(post_save, sender=Kartlag)
def createJSON(sender, instance, **kwargs):
    dict = {}
    for kartlag in Kartlag.objects.all():
        # legg til sjekk her for om det står publiser når vi lager egen fil til prod
        dict[kartlag.id] = {
            'dataeier': kartlag.dataeier.tittel,
            'tittel': kartlag.tittel
        }

        if kartlag.dataeier.logourl:
            dict[kartlag.id]['logourl'] = kartlag.dataeier.logourl
        if kartlag.dataeier.url:
            dict[kartlag.id]['kildeurl'] = kartlag.dataeier.url
        if kartlag.type:
            dict[kartlag.id]['type'] = kartlag.type.tittel
        if kartlag.tema:
            dict[kartlag.id]['tema'] = kartlag.tema.tittel
        if kartlag.produktark:
            dict[kartlag.id]['produktark'] = kartlag.produktark
        if kartlag.produktark:
            dict[kartlag.id]['produktark'] = kartlag.produktark
        if kartlag.geonorgeurl:
            dict[kartlag.id]['geonorgeurl'] = kartlag.geonorgeurl
        if kartlag.legendeurl:
            dict[kartlag.id]['legendeurl'] = kartlag.legendeurl
        if kartlag.wmsurl:
            dict[kartlag.id]['wmsurl'] = kartlag.wmsurl
        if kartlag.wmslayer:
            dict[kartlag.id]['wmslayer'] = kartlag.wmslayer
        if kartlag.klikkurl:
            dict[kartlag.id]['klikkurl'] = kartlag.klikkurl
        if kartlag.klikktekst:
            dict[kartlag.id]['klikktekst'] = kartlag.klikktekst

        if kartlag.tag:
            list = []
            for tag in kartlag.tag.all():
                list.append(tag.tittel)
            dict[kartlag.id]['tags'] = list

        # og så legg til nye felt, som tags osv
    with open("../public/kartlag.json", "w", encoding='utf8') as file:
        json.dump(dict, file, indent=4, sort_keys=True, ensure_ascii=False)
