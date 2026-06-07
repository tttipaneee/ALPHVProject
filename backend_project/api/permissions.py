from rest_framework import permissions

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom Django REST Framework authorization permission class:
    - Authenticated users are granted read-only access (SAFE_METHODS: GET, HEAD, OPTIONS).
    - Administrative users (staff users, is_staff=True) are granted full CRUD access:
      POST, PUT, PATCH, DELETE operations.
    """
    def has_permission(self, request, view):
        # 1. Check if the incoming request method is a Safe/Read-Only request
        if request.method in permissions.SAFE_METHODS:
            # Grant access if the user is authenticated (registered and logged in)
            return request.user and request.user.is_authenticated
        
        # 2. For write operations (POST, PUT, DELETE), verify if the user possesses administrative status
        return request.user and request.user.is_staff
