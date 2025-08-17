import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Room, Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_slug"]
        self.room_group_name = f"chat_{self.room_name}"
        self.user = self.scope["user"]

        # Add user to the room
        await self.add_user(self.room_name, self.user)

        # Join channel group
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Remove user from room
        await self.remove_user(self.room_name, self.user)
        # Leave channel group
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message", "")
        username = data.get("username", "Anonymous")  # <-- use frontend username
        print(username)

        # Save message (optional)
        if self.user.is_authenticated:
            await self.save_message(self.room_name, self.user, message)

        # Broadcast to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": username,
            }
    )


    async def chat_message(self, event):
        message = event["message"]
        username = event["username"]

        # Send message back to WebSocket
        message_html = f"{username}: {message}"
        await self.send(text_data=json.dumps({"message": message_html}))

    @sync_to_async
    def save_message(self, room_slug, user, message):
        room = Room.objects.get(slug=room_slug)
        Message.objects.create(room=room, user=user, message=message)

    @sync_to_async
    def add_user(self, room_slug, user):
        room = Room.objects.get(slug=room_slug)
        # Make sure user is evaluated from lazy object
        if hasattr(user, "_wrapped"):
            user = user._wrapped
        if user.is_authenticated and user not in room.users.all():
            room.users.add(user)
            room.save()

    @sync_to_async
    def remove_user(self, room_slug, user):
        room = Room.objects.get(slug=room_slug)
        if hasattr(user, "_wrapped"):
            user = user._wrapped
        if user.is_authenticated and user in room.users.all():
            room.users.remove(user)
            room.save()
