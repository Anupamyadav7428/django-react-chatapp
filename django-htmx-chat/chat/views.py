import string
import random
from django.utils.text import slugify
from chat.models import Room
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def room_create(request):
    room_name = request.data.get("room_name")
    if not room_name:
        return Response({"error": "Room name is required"}, status=status.HTTP_400_BAD_REQUEST)

    uid = ''.join(random.choices(string.ascii_letters + string.digits, k=4))
    room_slug = slugify(f"{room_name}_{uid}")
    room = Room.objects.create(name=room_name, slug=room_slug)

    return Response({"name": room.name, "slug": room.slug}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_join_room(request):
    room_slug = request.data.get('room_slug')
    if not room_slug:
        return Response({"error": "room_slug is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        room = Room.objects.get(slug=room_slug)
        return Response({"name": room.name, "slug": room.slug}, status=status.HTTP_200_OK)
    except Room.DoesNotExist:
        return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
