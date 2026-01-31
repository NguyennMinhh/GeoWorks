from django.db import models
from django.contrib.auth.models import User
from core.models import TimeStampedModel
from django.core.validators import MaxValueValidator
from django.contrib.gis.db import models


# Create your models here.
class UserProfile(TimeStampedModel):
    choices = [
        ('admin', 'Admin'),
        ('shipper', 'Shipper'),
        ('customer', 'Customer'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=choices, default='customer')
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def __str__(self):
        return self.user.username
    
class ShipperProfile(TimeStampedModel):
    VEHICLE_CHOICES = [
        ('bike', 'Bike'),
        ('motorbike', 'Motorbike'),
        ('car', 'Car'),
        ('truck', 'Truck'),
    ]
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='shipper_profile',
        limit_choices_to={'profile__role': 'shipper'}
    )
    phone = models.CharField(max_length=15, unique=True)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_CHOICES)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - {self.vehicle_type}"
    
    
