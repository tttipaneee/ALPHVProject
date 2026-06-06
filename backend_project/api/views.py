from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import VisualItem
from .serializers import VisualItemSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class ItemViewSet(viewsets.ModelViewSet):
    queryset = VisualItem.objects.all().order_by('-timestamp')
    serializer_class = VisualItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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

    def perform_destroy(self, instance):
        instance.delete()
        self.trigger_broadcast() # Broadcast on Delete