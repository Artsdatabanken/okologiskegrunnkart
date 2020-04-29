from django.contrib import admin
from .models import *

class UnderKartlagInline(admin.StackedInline):
    model = UnderKartlag

class KartlagAdmin(admin.ModelAdmin):
    inlines = [
        UnderKartlagInline,
    ]

admin.site.register(Tema)
admin.site.register(UnderKartlag)
admin.site.register(Kartlag,KartlagAdmin)
admin.site.register(Tag)
admin.site.register(Dataeier)
admin.site.register(Type)
