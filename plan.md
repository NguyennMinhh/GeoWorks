1, Tóm tắt Phân tích tìm vị trí nhà ở:

- Để tìm vị trí nhà ở tốt ở khu vực nào đó, người dùng sẽ cần biết địa điểm sau:
  o trường học, bệnh viện, siêu thị, công viên, hồ bơi, …
  o giao thông công cộng (bus, ga Metro, …)
  o vùng ngập lụt
  o khu công nghiệp, bãi rác
- Cùng với đó, cần có các tool phân tích địa lý như:
  o Tool Buffer: Thống kê có bao nhiêu tiện ích (trường học, chợ...) nằm trong vòng tròn đó.
  o Tool Accessibility: Tính khoảng cách từ một vị trí đến con đường lớn gần nhất, trả về khoảng cách theo mét hoặc thời gian đi bộ dự kiến.
  o Tool Tìm vị trí tối ưu theo tiêu chí (Multi-Criteria Analysis - MCA):
   Kết quả: Hệ thống sẽ tự động tô màu các vùng trên bản đồ (Heatmap). Vùng nào thỏa mãn nhiều tiêu chí nhất sẽ có màu Xanh đậm, vùng nào không thỏa mãn sẽ có màu Đỏ.
   Giả sử bạn có 3 yêu cầu, hệ thống sẽ thực hiện 3 phép toán không gian riêng biệt, sau đó mới gộp lại:
  • Bước 1 (Lớp Trường học): Hệ thống lấy tất cả các điểm trường học, vẽ vòng tròn bán kính $1km$ xung quanh chúng ($ST\_Buffer$). Những vùng này được gán giá trị 1, vùng ngoài là 0.
  • Bước 2 (Lớp Công viên): Tương tự, hệ thống vẽ vòng tròn $500m$ quanh các công viên. Vùng trong vòng tròn là 1, vùng ngoài là 0.
  • Bước 3 (Lớp Ngập lụt): Hệ thống lấy vùng Polygon ngập lụt. Những vùng không ngập được gán giá trị 1, vùng ngập gán giá trị 0.
  • Bước 4:

o Tool Routing: Hiển thị thông tin chi tiết đường đi (=đi bộ, xe máy, v.v.) từ vị trí nhà ở đến các vị trí cần đến như cửa hàng, trường học, v.v
 Ví dụ: Người dùng click chọn một căn nhà (Point A), sau đó chọn loại mục tiêu (ví dụ: Bệnh viện).
• B1: Hệ thống sẽ tự động tìm bệnh viện gần nhất (hoặc tất cả bệnh viện trong vùng).
• B2: Vẽ đường đi men theo các con phố từ nhà đến đó.
• B3: Hiển thị bảng thông tin: "Khoảng cách: 1.2km - Thời gian đi bộ: 15 phút".
2, Các Layer cần dùng:
2.1 Các địa điểm:
Tên Mục tiêu Nguồn
Trường học - school Sẽ thuận tiện nếu trong gia đình có trẻ nhỏ cần đi học OSM
Bệnh viện - hospital Việc nhà gần bệnh viện rất cấp thiết OSM
Siêu thị Thuận tiện cho việc đi lại và mua sắm mỗi ngày null
Công viên Đi bộ, thể dục và thư giãn null
Hồ bơi Bơi null
Chợ - marketplace Địa điểm mua bán OSM
gym Tập gym null
Đồn cảnh sát - police Ở gần đồn cảnh sát sẽ giúp người dùng được an toàn hơn OSM
Trụ sở uỷ ban nhân dân - townhall Giúp người dùng đi lại thuận tiện hơn khi cần làm việc liên quan đến giấy tờ OSM
2.2 Giao thông công cộng:
Tên Mục tiêu Nguồn
bến xe Buýt Nhiều người dùng hay sử dụng xe buýt để đi lại null

2.3 Vùng ngập lụt, thiên tai, v.v
Tên Mục tiêu Nguồn
Đường link hướng dẫn:

- FLOOD RISK MAPPING USING GIS AND MULTI-CRITERIA ANALYSIS - DANIELA RINCON ET AL. ARTICLE METHODOLOGY - YouTube
- Flood Risk Mapping Using GIS and Multi-Criteria Analysis: A Greater Toronto Area Case Study | MDPI
  2.4 Vùng công nghiệp, rác, v.v
  Tên Mục tiêu Nguồn
