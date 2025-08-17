from django.urls import path
from django.views.generic import TemplateView
from chat import views


urlpatterns = [
    path("", TemplateView.as_view(template_name="base.html"), name='index'),
    # path("chat/room/<str:slug>/", views.index, name='chat'),
    path("api/create/", views.room_create, name='room-create'),
    path("api/join/", views.api_join_room, name='room-join'),
]
