from django.db import models

class VisualItem(models.Model):
    name = models.CharField(max_length=255)
    shape = models.CharField(max_length=50) # circle, square, triangle
    color = models.CharField(max_length=50) # red, blue, green, etc.
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name