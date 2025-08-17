import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "your_project_name.settings")

# Standard Django ASGI app to handle traditional HTTP requests
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    # HTTP requests go to Django
    "http": django_asgi_app,

    # WebSocket requests go to Channels
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
