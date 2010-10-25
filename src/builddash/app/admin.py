from django.contrib import admin
from builddash.app.models import Message

class MessageAdmin(admin.ModelAdmin):
    list_display = ('message', 'show', 'currently_showing')
    search_fields = ('message',)

admin.site.register(Message, MessageAdmin)