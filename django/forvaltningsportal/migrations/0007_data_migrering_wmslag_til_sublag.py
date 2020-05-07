# Skrevet av Helene, 7.5.2020
from django.db import migrations, models
from forvaltningsportal.models import createJSON

# Pythonfunksjon for å hente ut data og opprette nye sublag
def make_all_sublayers(apps,schema_editor):
    Kartlag = apps.get_model('forvaltningsportal','Kartlag')
    Sublag = apps.get_model('forvaltningsportal','Sublag')

    # Går over gamle modellen for å hente ut det som skal omplasseres
    for kartlag in Kartlag.objects.all():

        if(kartlag.wmsurl):
            # Dette blir datane for det nye underlaget.
            print("*** Kopierer wms-laget "+kartlag.tittel+" til sublag ***")
            new_sublag = Sublag()
            new_sublag.tittel = kartlag.tittel
            new_sublag.wmslayer = kartlag.wmslayer
            new_sublag.legendeurl = kartlag.legendeurl
            new_sublag.erSynlig = True # Alle hovedlag settes initielt til synlige
            new_sublag.hovedkartlag = kartlag # Kobles tilbake til eksisterende lag
            new_sublag.save()

        else:
            print("---" + kartlag.tittel + "har ikke wmsurl, derfor irrelevant ---")

    createJSON(None,None)

class Migration(migrations.Migration):
    dependencies = [
        ('forvaltningsportal', '0006_auto_20200506_1504'),
    ]

    operations = [
        migrations.RunPython(make_all_sublayers),
    ]
