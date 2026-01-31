from django.contrib.gis.db import models
from django.contrib.auth.models import User
from core.models import TimeStampedModel

# from backend import orders, users


class Order(TimeStampedModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    shipper = models.ForeignKey("users.ShipperProfile", on_delete=models.SET_NULL, null=True, blank=True)
    item = models.ForeignKey("inventory.ItemOnSale", on_delete=models.CASCADE)
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    order_code = models.CharField(max_length=50, unique=True)
    item_quantity = models.PositiveIntegerField()
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15)
    delivery_address = models.CharField(max_length=500)
    delivery_location = models.PointField(srid=4326, geography=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)

    def __str__(self):
        return f"Order {self.order_code} - {self.status}"
    
    class Meta:
        indexes = [
            # Query: Đơn hàng mới nhất theo status
            models.Index(fields=['status', '-created_at'], name='status_created_time'),

            # Query: Đơn chưa có shipper (để phân công)
            models.Index(fields=['status', 'shipper'], name='order_unassigned'),
        ]

        