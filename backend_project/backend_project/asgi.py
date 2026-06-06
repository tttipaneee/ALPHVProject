import os
import django
from django.core.asgi import get_asgi_application

# 1. Set the settings environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')

# 2. Force Django to fully initialize EVERYTHING
django.setup()

# 3. NOW import the WebSocket routers safely
from channels.routing import ProtocolTypeRouter, URLRouter
from api.routing import websocket_urlpatterns

# 4. Build the final application
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(
        websocket_urlpatterns
    ),
})