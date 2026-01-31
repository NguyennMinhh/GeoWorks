from django.db import models
from django.core.validators import MaxValueValidator
from backend.core.models import TimeStampedModel

# from layers.models import Warehouse

# Create your models here.
class ItemOnSale(TimeStampedModel):
    TYPE_CHOICES = [
        ('electronics', 'Electronics'),
        ('clothing', 'Clothing'),
        ('books', 'Books'),
        ('furniture', 'Furniture'),
    ]
    warehouse = models.ForeignKey("layers.Warehouse", on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(null=True, blank=True)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    sale = models.FloatField(default=0.0, validators=[MaxValueValidator(100.0)])  # percentage discount
    item_type = models.CharField(max_length=50, choices=TYPE_CHOICES, db_index=True)

    class Meta: 
        indexes = [
            # Query: Lọc theo loại hàng đang được giảm giá và loại hoàng
            models.Index(fields=['sale', 'item_type'], name='sale_item_type_index'),
        ]