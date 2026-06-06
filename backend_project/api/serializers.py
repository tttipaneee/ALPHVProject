from rest_framework import serializers
from .models import VisualItem

class VisualItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisualItem
        fields = ['id', 'name', 'shape', 'color', 'timestamp']

    # Strict Validation Logic
    def validate(self, data):
        if not data.get('name') or data.get('name').strip() == "":
            raise serializers.ValidationError({"name": "Name field cannot be empty."})
        if data.get('shape') not in ['circle', 'square', 'triangle']:
            raise serializers.ValidationError({"shape": "Invalid shape type selected."})
        if not data.get('color') or data.get('color').strip() == "":
            raise serializers.ValidationError({"color": "Color field cannot be empty."})
        return data