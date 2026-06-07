import logging
from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import VisualItem
from .serializers import VisualItemSerializer, UserRegistrationSerializer, CustomTokenObtainPairSerializer
from .permissions import IsAdminUserOrReadOnly
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User

# Configure backend console logger to output execution flow details
logger = logging.getLogger(__name__)

class ItemViewSet(viewsets.ModelViewSet):
    """
    ModelViewSet handling CRUD endpoints for VisualItem records:
    - GET /api/items/       : Lists all shapes ordered by descending timestamp.
    - POST /api/items/      : Deploys a new shape (Admin only).
    - PUT /api/items/{id}/  : Updates an existing shape (Admin only).
    - DELETE /api/items/{id}: Removes a shape from the database (Admin only).
    
    Enforces authorization rules via IsAdminUserOrReadOnly.
    Triggers WebSocket broadcast alerts on every write action.
    """
    queryset = VisualItem.objects.all().order_by('-timestamp')
    serializer_class = VisualItemSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def trigger_broadcast(self):
        """
        Broadcasting mechanism utilizing Django Channels layer.
        Dispatches a payload trigger to the "matrix" group. Daphne
        relays this payload to all active WebSocket connections.
        """
        logger.info("[WebSocket Engine] Broadcasting state update signal to group 'matrix'...")
        print("[SERVER LOG] [WebSockets] Broadcasting state refresh request to group 'matrix'.")
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "matrix",
            { "type": "item_update" }
        )

    def perform_create(self, serializer):
        """
        Intercepts creation, logs the user creating the shape,
        and fires the websocket broadcast signal on database save.
        """
        item = serializer.save()
        user_info = self.request.user.username if self.request.user else 'System'
        logger.info(f"[API Actions] Shape '{item.name}' ({item.shape}/{item.color}) created by admin: {user_info}")
        print(f"[SERVER LOG] [POST] Deployed new shape: '{item.name}' by admin '{user_info}'")
        self.trigger_broadcast()

    def perform_update(self, serializer):
        """
        Intercepts modification, logs the changes,
        and triggers a WebSocket broadcast on database save.
        """
        item = serializer.save()
        user_info = self.request.user.username if self.request.user else 'System'
        logger.info(f"[API Actions] Shape '{item.name}' (ID: {item.id}) updated by admin: {user_info}")
        print(f"[SERVER LOG] [PUT] Modified shape ID {item.id}: '{item.name}' by admin '{user_info}'")
        self.trigger_broadcast()

    def perform_destroy(self, instance):
        """
        Intercepts deletion, logs the deleted item details,
        and triggers a WebSocket broadcast on database deletion.
        """
        item_id = instance.id
        item_name = instance.name
        user_info = self.request.user.username if self.request.user else 'System'
        logger.info(f"[API Actions] Shape '{item_name}' (ID: {item_id}) deleted by admin: {user_info}")
        print(f"[SERVER LOG] [DELETE] Removed shape ID {item_id}: '{item_name}' by admin '{user_info}'")
        instance.delete()
        self.trigger_broadcast()


class UserRegistrationView(generics.CreateAPIView):
    """
    Public registration endpoint enabling new users to create accounts:
    - POST /api/register/
    Accepts username, password, and is_staff flags.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        role = "Admin/Staff" if user.is_staff else "Regular User"
        logger.info(f"[Auth Engine] Registered new account: '{user.username}' as role: '{role}'")
        print(f"[SERVER LOG] [Auth] Registered new account '{user.username}' with role '{role}'")


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom TokenObtainPairView that leverages CustomTokenObtainPairSerializer
    to yield client-side JWT keys and staff context flags.
    """
    serializer_class = CustomTokenObtainPairSerializer