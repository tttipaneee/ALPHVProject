from rest_framework import permissions

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission:
    - Regular users can only GET (Read-Only)
    - Admin users (is_staff=True) can POST, PUT, DELETE.
    """
    def has_permission(self, request, view):
        # Always allow GET requests if the user is logged in
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # For POST/DELETE, check if they are an admin
        return request.user and request.user.is_staff