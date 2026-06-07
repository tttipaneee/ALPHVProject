from rest_framework import serializers
from .models import VisualItem
from django.contrib.auth.models import User

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

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_staff = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'is_staff']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            is_staff=validated_data.get('is_staff', False)
        )
    
