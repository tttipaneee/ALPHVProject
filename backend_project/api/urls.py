from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, UserRegistrationView, CustomTokenObtainPairView

router = DefaultRouter()
router.register(r'items', ItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # This automatically handles login and generates the expiring JWT with staff validation flag!
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('register/', UserRegistrationView.as_view(), name='register'),
]