from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
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
    geonorgeurl = models.CharField(max_length=500, blank=True)
    faktaark = models.CharField(max_length=500, blank=True)
    produktark = models.CharField(max_length=500, blank=True)
    dataeier = models.ForeignKey(Dataeier, on_delete=models.CASCADE)
    tema = models.ForeignKey(
        Tema, on_delete=models.SET_NULL, null=True, blank=True)
    tag = models.ManyToManyField(Tag, blank=True)
    publiser = models.BooleanField(default=False)
    wmsurl = models.CharField(max_length=500, blank=True)
    wmsversion = models.CharField(max_length=500, blank=True)
    projeksjon = models.CharField(max_length=500, blank=True)
    wmsinfolayers = models.CharField(max_length=500, blank=True)
    testkoordinater = models.CharField(max_length=500, blank=True)
    wmsinfoformat = models.CharField(max_length=500, blank=True)
    klikkurl = models.CharField(max_length=500, blank=True)
    klikktekst = models.CharField(max_length=500, blank=True)
    klikktekst2 = models.CharField(max_length=500, blank=True)
    type = models.ForeignKey(
        Type, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.tittel

# Brukes av "wms-assistent" for å få tilgang til de felt den skal oppdatere i Django
class WmsHelper(models.Model):
    tittel = models.CharField(max_length=200, blank=True, null=True)
    wmsurl = models.CharField(max_length=500, blank=True)
    wmsversion = models.CharField(max_length=500, blank=True)
    projeksjon = models.CharField(max_length=500, blank=True)
    wmsinfolayers = models.CharField(max_length=500, blank=True)
    testkoordinater = models.CharField(max_length=500, blank=True)
    wmsinfoformat = models.CharField(max_length=500, blank=True)
    klikkurl = models.CharField(max_length=500, blank=True)
    klikktekst = models.CharField(max_length=500, blank=True)
    klikktekst2 = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return self.tittel

    class Meta:
        db_table = 'forvaltningsportal_kartlag'
        managed = False

class Sublag(models.Model):
    tittel = models.CharField(max_length=200)
    wmslayer = models.CharField(max_length=100, blank=True)
    legendeurl = models.CharField(max_length=500, blank=True)
    publiser = models.BooleanField(default=False)
    erSynlig = models.BooleanField(default=False)
    hovedkartlag = models.ForeignKey(Kartlag,on_delete=models.CASCADE, related_name="sublag")
    queryable = models.BooleanField(default=False)
    minscaledenominator = models.PositiveIntegerField(null=True, blank=True)
    maxscaledenominator = models.PositiveIntegerField(null=True, blank=True)
    suggested = models.BooleanField(default=False)

    def __str__(self):
        return self.tittel

@receiver(post_save, sender=Kartlag)
@receiver(post_save, sender=Sublag)
@receiver(post_delete, sender=Kartlag)
@receiver(post_delete, sender=Sublag)
# Når vi setter opp den automatiske koblingen mellom WMS-admin-toolen og Django, legg til denne igjen
#@receiver(post_save, sender=WmsHelper)
def createJSON(sender, instance, **kwargs):
    dict = {}
    for kartlag in Kartlag.objects.all():
        # legg til sjekk her for om det står publiser når vi lager egen fil til prod
        dict[kartlag.id] = {
            'dataeier': kartlag.dataeier.tittel,
            'tittel': kartlag.tittel
        }

        if kartlag.sublag.count():
            alle_underlag = kartlag.sublag.all()
            underlag = {}
            for lag in alle_underlag:
                if lag.publiser:
                    lag_json = {}
                    if lag.tittel:
                        lag_json['tittel'] = lag.tittel
                    if lag.wmslayer:
                        lag_json['wmslayer'] = lag.wmslayer
                    if lag.legendeurl:
                        lag_json['legendeurl'] = lag.legendeurl
                    
                    lag_json['queryable'] = lag.queryable
                    lag_json['minscaledenominator'] = lag.minscaledenominator
                    lag_json['maxscaledenominator'] = lag.maxscaledenominator
                    lag_json['erSynlig'] = lag.erSynlig
                    lag_json['suggested'] = lag.suggested
                    underlag[lag.id] = lag_json
            
            dict[kartlag.id]['underlag'] = underlag

        if kartlag.dataeier.logourl:
            dict[kartlag.id]['logourl'] = kartlag.dataeier.logourl
        if kartlag.dataeier.url:
            dict[kartlag.id]['kildeurl'] = kartlag.dataeier.url
        if kartlag.type:
            dict[kartlag.id]['type'] = kartlag.type.tittel
        if kartlag.tema:
            dict[kartlag.id]['tema'] = kartlag.tema.tittel
        if kartlag.faktaark:
            dict[kartlag.id]['faktaark'] = kartlag.faktaark
        if kartlag.produktark:
            dict[kartlag.id]['produktark'] = kartlag.produktark
        if kartlag.geonorgeurl:
            dict[kartlag.id]['geonorgeurl'] = kartlag.geonorgeurl
        if kartlag.wmsurl:
            dict[kartlag.id]['wmsurl'] = kartlag.wmsurl
        if kartlag.wmsversion:
            dict[kartlag.id]['wmsversion'] = kartlag.wmsversion
        if kartlag.projeksjon:
            dict[kartlag.id]['projeksjon'] = kartlag.projeksjon
        if kartlag.wmsinfoformat:
            dict[kartlag.id]['wmsinfoformat'] = kartlag.wmsinfoformat
        if kartlag.wmsinfolayers:
            dict[kartlag.id]['wmsinfolayers'] = kartlag.wmsinfolayers
        if kartlag.testkoordinater:
            dict[kartlag.id]['testkoordinater'] = kartlag.testkoordinater
        if kartlag.klikkurl:
            dict[kartlag.id]['klikkurl'] = kartlag.klikkurl
        if kartlag.klikktekst:
            dict[kartlag.id]['klikktekst'] = kartlag.klikktekst
        if kartlag.klikktekst:
            dict[kartlag.id]['klikktekst2'] = kartlag.klikktekst2

        if kartlag.tag:
            list = []
            for tag in kartlag.tag.all():
                list.append(tag.tittel)
            dict[kartlag.id]['tags'] = list

        # kartlag-fil for bruk i wms-hjelpeverktøy
        # Når vi setter opp den automatiske koblingen mellom WMS-admin-toolen og Django, legg til denne igjen
    #with open("./forvaltningsportal/static/kartlag.json", "w", encoding='utf8') as file:
        #json.dump(dict, file, indent=4, sort_keys=True, ensure_ascii=False)
        # kartlag-fil for innsynsløsning
    with open("../public/kartlag.json", "w", encoding='utf8') as file:
        json.dump(dict, file, indent=4, sort_keys=True, ensure_ascii=False)
