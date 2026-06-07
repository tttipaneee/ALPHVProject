from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import VisualItem
from .serializers import VisualItemSerializer, UserRegistrationSerializer
from .permisssions import IsAdminUserOrReadOnly
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User

class ItemViewSet(viewsets.ModelViewSet):
    queryset = VisualItem.objects.all().order_by('-timestamp')
    serializer_class = VisualItemSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def trigger_broadcast(self):
        # Send a message to the "matrix" radio tower group
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "matrix",
            { "type": "item_update" }
        )

    def perform_create(self, serializer):
        serializer.save()
        self.trigger_broadcast() # Broadcast on Add

    def perform_update(self, serializer):
        serializer.save()
        self.trigger_broadcast() # Broadcast on Update

    def perform_destroy(self, instance):
        instance.delete()
        self.trigger_broadcast() # Broadcast on Delete


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]