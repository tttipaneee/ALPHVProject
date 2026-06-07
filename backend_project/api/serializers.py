from rest_framework import serializers
from .models import VisualItem
from django.contrib.auth.models import User

class VisualItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the VisualItem model mapping shape metadata fields.
    Implements a backend double-guard validation layer to check data inputs.
    """
    class Meta:
        model = VisualItem
        fields = ['id', 'name', 'shape', 'color', 'timestamp']

    def validate(self, data):
        """
        Custom validation enforcing database constraint checks:
        - Prevents empty or white-spaced shape names.
        - Enforces permitted shape types: circle, square, triangle.
        - Prevents empty shape color fields.
        """
        # 1. Verify Name constraint
        name_val = data.get('name')
        if not name_val or name_val.strip() == "":
            raise serializers.ValidationError({"name": "Name field cannot be empty or blank."})
        
        # 2. Verify Shape Type constraint
        shape_val = data.get('shape')
        if shape_val not in ['circle', 'square', 'triangle']:
            raise serializers.ValidationError({"shape": f"Invalid shape type '{shape_val}' selected."})
        
        # 3. Verify Color constraint
        color_val = data.get('color')
        if not color_val or color_val.strip() == "":
            raise serializers.ValidationError({"color": "Color field cannot be empty or blank."})
            
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer handling user signups, enabling user account instantiation.
    - Username and password fields are required.
    - Password is configured as write_only to prevent leakage in response payloads.
    - Supports setting the is_staff flag for administrative permission grants.
    """
    password = serializers.CharField(write_only=True)
    is_staff = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'is_staff']

    def create(self, validated_data):
        """
        Creates a new user record inside the Django authentication database.
        Automatically handles password hashing via Django's secure pbkdf2 algorithm.
        """
        return User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            is_staff=validated_data.get('is_staff', False)
        )
