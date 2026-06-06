from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import VisualItem

class ItemApiTests(APITestCase):

    def setUp(self):
        self.admin_user = User.objects.create_superuser(username='admin', password='password')
        self.item_url = '/api/items/'

    def test_unauthenticated_user_can_read_data(self):
        response = self.client.get(self.item_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_user_cannot_write_data(self):
        data = {"name": "Test", "shape": "circle", "color": "red"}
        response = self.client.post(self.item_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_validation_prevents_empty_names(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {"name": "", "shape": "circle", "color": "red"}
        response = self.client.post(self.item_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)