import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

# Setup consumer logger to track connection logs
logger = logging.getLogger(__name__)

class ItemConsumer(AsyncWebsocketConsumer):
    """
    Asynchronous WebSocket Consumer class managing client-server connection tunnels.
    Handles joining broadcast groups on connect, discarding groups on disconnect,
    and pushing real-time refresh frames to active sockets.
    """

    async def connect(self):
        """
        Triggered when a client initiates a WebSocket handshake on '/ws/items/'.
        Adds the socket channel name to the global 'matrix' broadcast group.
        Accepts the connection, completing the handshake.
        """
        # Join the 'matrix' broadcast group to listen for server-side state updates
        await self.channel_layer.group_add("matrix", self.channel_name)
        
        # Complete handshake and establish connection
        await self.accept()
        
        logger.info(f"[WebSocket Consumer] Client connected: {self.channel_name} joined group 'matrix'")
        print(f"[SERVER LOG] [WS Connect] Connection established for channel: {self.channel_name}")

    async def disconnect(self, close_code):
        """
        Triggered when the client terminates the socket session.
        Removes the channel from the 'matrix' broadcast group to prevent dead reference memory.
        """
        # Discard the channel from the broadcast pool
        await self.channel_layer.group_discard("matrix", self.channel_name)
        
        logger.info(f"[WebSocket Consumer] Client disconnected: {self.channel_name} left group 'matrix'")
        print(f"[SERVER LOG] [WS Disconnect] Connection closed for channel: {self.channel_name} (Code: {close_code})")

    async def item_update(self, event):
        """
        Callback handler invoked when the Django views broadcast an event to group 'matrix'.
        Pushes a text frame payload back to the client browser prompting a state fetch.
        """
        logger.info(f"[WebSocket Consumer] Dispatching 'update_matrix' frame to client socket {self.channel_name}")
        print(f"[SERVER LOG] [WS Broadcast] Dispatching 'update_matrix' frame to {self.channel_name}")
        
        # Send update trigger frame to frontend client
        await self.send(text_data=json.dumps({
            'type': 'update_matrix'
        }))