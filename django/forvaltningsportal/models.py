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
    logourl = models.CharField(max_length=500,blank=True)
    url = models.CharField(max_length=500,blank=True)
    def __str__(self):
        return self.tittel

class Type(models.Model):
    tittel = models.CharField(max_length=200)
    def __str__(self):
        return self.tittel

class Kartlag(models.Model):
    tittel = models.CharField(max_length=200)
    kode = models.CharField(max_length=50,blank=True)
    wmsurl = models.CharField(max_length=500,blank=True)
    wmslayer = models.CharField(max_length=100,blank=True)
    faktaark = models.CharField(max_length=500,blank=True)
    klikkurl = models.CharField(max_length=500,blank=True)
    type = models.ForeignKey(Type, on_delete=models.SET_NULL, null=True)
    dataeier = models.ForeignKey(Dataeier, on_delete=models.CASCADE)
    tema = models.ForeignKey(Tema, on_delete=models.SET_NULL, null=True)
    tag = models.ManyToManyField(Tag, blank=True)
    def __str__(self):
       return self.tittel


@receiver(post_save, sender=Kartlag)
def createJSON(sender, instance, **kwargs):
    print("************Doing the thing************")

    dict = {}
    for kartlag in Kartlag.objects.all():
        dict[kartlag.tittel] = {
            'dataeier': kartlag.dataeier.tittel,
            'tittel': kartlag.tittel
        }
        if kartlag.type:
            dict[kartlag.tittel]['type'] = kartlag.type.tittel
        if kartlag.tema:
            dict[kartlag.tittel]['tema'] = kartlag.tema.tittel
        if kartlag.faktaark:
            dict[kartlag.tittel]['faktaark'] = kartlag.faktaark
        if kartlag.wmsurl:
            dict[kartlag.tittel]['wmsurl'] = kartlag.wmsurl
        if kartlag.wmslayer:
            dict[kartlag.tittel]['wmslayer'] = kartlag.wmslayer
        if kartlag.kode:
            dict[kartlag.tittel]['kode'] = kartlag.kode
        if kartlag.klikkurl:
            dict[kartlag.tittel]['klikkurl'] = kartlag.klikkurl

        # og så legg til nye felt, som tags osv


    print(json.dumps(dict,indent=4,sort_keys=True))
    with open("kartlag_ny.json","w", encoding='utf8') as file:
        json.dump(dict,file,indent=4,sort_keys=True, ensure_ascii=False)

    print("************FINISHED doing the thing************")
