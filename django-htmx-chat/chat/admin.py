from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Message)
admin.site.register(Room)


# def MessageAdmin():
#     list_display = ('id', 'room', 'user', 'message', 'created_at')
#     list_filter = ('room', 'user', 'created_at')
#     search_fields = ('message',)

        