from django.contrib import admin
from .models import *

class SublagInline(admin.StackedInline):
    model = Sublag

class KartlagAdmin(admin.ModelAdmin):
    inlines = [
        SublagInline,
    ]
    search_fields = ['tittel']

class SublagAdmin(admin.ModelAdmin):
    model = Sublag
    search_fields = ['tittel', 'wmslayer']

admin.site.register(Tema)
admin.site.register(Kartlag, KartlagAdmin)
admin.site.register(Tag)
admin.site.register(Dataeier)
admin.site.register(Type)
admin.site.register(Sublag, SublagAdmin)

# Når vi setter opp den automatiske koblingen mellom WMS-admin-toolen og Django, legg til denne igjen
#admin.site.register(WmsHelper)
