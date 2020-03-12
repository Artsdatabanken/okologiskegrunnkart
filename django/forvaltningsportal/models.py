from django.db import models
#from django.contrib.auth.models import User

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
    logourl = models.CharField(max_length=500)
    url = models.CharField(max_length=500)
    def __str__(self):
        return self.tittel

class Type(models.Model):
    tittel = models.CharField(max_length=200)
    def __str__(self):
        return self.tittel

class Kartlag(models.Model):
    tittel = models.CharField(max_length=200)
    kode = models.CharField(max_length=50)
    karturl = models.CharField(max_length=500)
    faktaark = models.CharField(max_length=500)
    klikkurl = models.CharField(max_length=500)
    type = models.ForeignKey(Type, on_delete=models.SET_NULL, null=True)
    dataeier = models.ForeignKey(Dataeier, on_delete=models.CASCADE)
    tema = models.ForeignKey(Tema, on_delete=models.SET_NULL, null=True)
    tag = models.ManyToManyField(Tag)
    def __str__(self):
       return self.tittel
