# Generated by Django 3.0.4 on 2020-04-29 12:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('forvaltningsportal', '0003_auto_20200416_1348'),
    ]

    operations = [
        migrations.CreateModel(
            name='UnderKartlag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tittel', models.CharField(max_length=200)),
                ('wmsurl', models.CharField(blank=True, max_length=500)),
                ('wmslayer', models.CharField(blank=True, max_length=100)),
                ('legendeurl', models.CharField(blank=True, max_length=500)),
                ('publiser', models.BooleanField(default=False)),
                ('erSynlig', models.BooleanField(default=False)),
                ('hovedkartlag', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='forvaltningsportal.Kartlag')),
            ],
        ),
    ]
