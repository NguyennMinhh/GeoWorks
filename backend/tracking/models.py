from django.db import models
from django.contrib.gis.db import models
from backend.core.models import TimeStampedModel

# Create your models here.
class ShipperLocation(TimeStampedModel):
    shipper = models.ForeignKey("users.ShipperProfile", on_delete=models.CASCADE)
    location = models.PointField(srid=4326, geography=True)
    timestamp = models.DateTimeField(db_index=True)

    def __str__(self):
        return f"Location of {self.shipper.user.username} at {self.timestamp}"
    
    class Meta:
        indexes = [
            # Query: Vị trí mới nhất của shipper
            models.Index(fields=['shipper', '-timestamp'], name='shipper_latest_location'),
        ]