from django.contrib.gis.db import models
from core.models import TimeStampedModel






# -  Lưu ý:
# Map sẽ không lấy vị trí các điểm, đường, vùng từ API mỗi lần gọi, mà nó sẽ chỉ gọi 1 lần và dùng Python Scripting để lưu các dữ liệu API đó vào db, điều này giúp giảm tải cho server và tăng tốc độ phản hồi khi người dùng tương tác với bản đồ

# Lớp Point
# class SchoolLocation(TimeStampedModel):
#     osm_id = models.BigIntegerField()
#     type = models.CharField(max_length=50, default='node')
#     name = models.CharField(max_length=255, null=True, blank=True)
    
#     # Phân loại amenity theo OSM, ví dụ: school, college, university, kindergarten, preschool, ...
#     category = models.CharField(max_length=100, null=True, blank=True, db_index=True)
#     location = models.PointField(srid=4326, geography=True) # tạo từ "lat" và "lon"
#     tags = models.JSONField(default=dict, null=True, blank=True)

#     class Meta:
#         unique_together = ('osm_id', 'type')

#     def __str__(self):
#         return f"[{self.category}] {self.name} - {self.osm_id}"

# Lớp LineString

# Lớp Polygon

