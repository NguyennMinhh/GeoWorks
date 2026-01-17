import { useContext } from "react";
import { ToolsContext } from "../BaseMap";
import GetStraightDistanceTool from './ToolItem';

const TOOLS = [
  {
    id: 1,
    name: "Tìm kiếm",
    description: "Tìm địa điểm theo tên (W.I.P)"
  },
  {
    id: 2,
    name: "Lọc",
    description: "Lọc dữ liệu theo điều kiện (W.I.P)"
  },
  {
    id: 3,
    code: "get_straight_distance",
    name: "Đo khoảng cách",
    description: "Đo khoảng cách giữa 2 điểm (Programming Demo)",
    component: GetStraightDistanceTool
  },
  {
    id: 4,
    name: "Thêm vector",
    description: "Vẽ Point/Line/Polygon vào khu vực trên bản đồ (W.I.P)"
  },
  {
    id: 5,
    name: "Đo diện tích",
    description: "Đo diện tích vùng trên bản đồ (W.I.P)"
  },
  {
    id: 6,
    name: "Đo chu vi",
    description: "Đo chu vi vùng trên bản đồ (W.I.P)"
  },
  {
    id: 7,
    name: "Tìm đường đi giữa 2 điểm",
    description: "Tìm đường đi ngắn nhất giữa 2 điểm trên bản đồ và hiển thị thông số (W.I.P)"
  },
  {
    id: 8,
    name: "Buffer quanh vector",
    description: "Tạo vùng buffer quanh vector trên bản đồ (W.I.P)"
  },
  {
    id: 9,
    name: "Chuyển đổi hệ tọa độ",
    description: "Chuyển đổi hệ tọa độ của các điểm/vector trên bản đồ (W.I.P)"
  },
  {
    id: 10,
    name: "Nhập/Xuất bản đồ",
    description: "Nhập/Xuất bản đồ hiện tại ra file hình ảnh (W.I.P)"
  },
  {
    id: 11,
    name: "Thay đổi bàn đồ nền",
    description: "Thay đổi loại bản đồ nền đang hiển thị (W.I.P)"
  }
];

export default function ToolsList() {
  const { selectedTool, setSelectedTool } = useContext(ToolsContext);

  return (
    <div style={{ padding: "12px" }}>
      <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600" }}>
        Công cụ
      </h3>
      
      {/* Nếu chưa chọn tool nào → Hiển thị danh sách */}
      {!selectedTool && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {TOOLS.map((tool) => (
            <div
              key={tool.id}
              onClick={() => setSelectedTool(tool.code)}
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#fff",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f9f9f9";
                e.currentTarget.style.borderColor = "#bbb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.borderColor = "#ddd";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div>
                  <div style={{ fontWeight: "500", fontSize: "14px" }}>
                    {tool.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                    {tool.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nếu đã chọn tool → Hiển thị tool đó */}
      {selectedTool === "get_straight_distance" && <GetStraightDistanceTool />}
      
      {/* Nút quay lại */}
      {selectedTool && (
        <button
          onClick={() => setSelectedTool(null)}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "12px",
            backgroundColor: "#666",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          ← Quay lại danh sách
        </button>
      )}
    </div>
  );
}
