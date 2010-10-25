from django.contrib import admin
from builddash.app.models import Message

class MessageAdmin(admin.ModelAdmin):
    pass

admin.site.register(Message, MessageAdmin)