# Generated by Django 3.0.7 on 2020-06-09 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forvaltningsportal', '0006_auto_20200506_1504'),
    ]

    operations = [
        migrations.CreateModel(
            name='WmsHelper',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tittel', models.CharField(blank=True, max_length=200, null=True)),
                ('wmsurl', models.CharField(blank=True, max_length=500)),
                ('wmsversion', models.CharField(blank=True, max_length=500)),
                ('projeksjon', models.CharField(blank=True, max_length=500)),
                ('wmsinfolayers', models.CharField(blank=True, max_length=500)),
                ('testkoordinater', models.CharField(blank=True, max_length=500)),
                ('wmsinfoformat', models.CharField(blank=True, max_length=500)),
                ('klikkurl', models.CharField(blank=True, max_length=500)),
                ('klikktekst', models.CharField(blank=True, max_length=500)),
                ('klikktekst2', models.CharField(blank=True, max_length=500)),
            ],
            options={
                'db_table': 'forvaltningsportal_kartlag',
                'managed': False,
            },
        ),
        migrations.RemoveField(
            model_name='kartlag',
            name='legendeurl',
        ),
        migrations.RemoveField(
            model_name='kartlag',
            name='wmslayer',
        ),
        migrations.AddField(
            model_name='kartlag',
            name='klikktekst2',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='kartlag',
            name='projeksjon',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='kartlag',
            name='testkoordinater',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='kartlag',
            name='wmsinfoformat',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='kartlag',
            name='wmsinfolayers',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='kartlag',
            name='wmsversion',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='sublag',
            name='maxscaledenominator',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='sublag',
            name='minscaledenominator',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='sublag',
            name='queryable',
            field=models.BooleanField(default=False),
        ),
    ]
