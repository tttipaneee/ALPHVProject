import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ItemConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join a universal broadcasting group called "matrix"
        await self.channel_layer.group_add("matrix", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group when the user closes the browser
        await self.channel_layer.group_discard("matrix", self.channel_name)

    # When the Radio Tower receives a broadcast, send it to the frontend
    async def item_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'update_matrix'
        }))