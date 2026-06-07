from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import ItemViewSet, UserRegistrationView

router = DefaultRouter()
router.register(r'items', ItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # This automatically handles login and generates the expiring JWT!
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('register/', UserRegistrationView.as_view(), name='register'),
]