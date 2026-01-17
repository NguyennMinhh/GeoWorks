import { useContext, useEffect, useRef, useState } from "react";
import { ToolsContext, MapContext } from "../BaseMap";
import distance from "@turf/distance";
import { point } from "@turf/helpers";
import { transform } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Point, LineString } from "ol/geom";
import { Style, Circle, Fill, Stroke, Text } from "ol/style";

export default function GetStraightDistanceTool() {
  const { mapInstance } = useContext(MapContext);
  const { selectedTool } = useContext(ToolsContext);

  // State để lưu danh sách các đường đã đo
  const [lineList, setLineList] = useState([]);
  
  // State để bật/tắt chế độ vẽ
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Lưu 2 điểm đang chọn (dùng state để UI cập nhật)
  const [tempPoints, setTempPoints] = useState([]);
  
  // Ref để lưu layer
  const vectorLayerRef = useRef(null);

  // Khởi tạo layer khi component mount
  useEffect(() => {
    if (!mapInstance.current || selectedTool !== "get_straight_distance") return;

    const map = mapInstance.current;

    // Tạo layer để vẽ
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);
    vectorLayerRef.current = vectorLayer;

    return () => {
      if (vectorLayerRef.current) {
        map.removeLayer(vectorLayerRef.current);
        vectorLayerRef.current = null;
      }
    };
  }, [selectedTool, mapInstance]);

  // Xử lý click trên bản đồ khi đang ở chế độ vẽ
  useEffect(() => {
    if (!mapInstance.current || !isDrawing) return;

    const map = mapInstance.current;

    const handleClick = (e) => {
      const coord3857 = e.coordinate;
      const coord4326 = transform(coord3857, "EPSG:3857", "EPSG:4326");

      // Thêm điểm vào mảng
      const newTempPoints = [
        ...tempPoints,
        {
          coord3857: coord3857,
          coord4326: coord4326,
        }
      ];

      setTempPoints(newTempPoints);

      console.log("Đã chọn điểm:", coord4326);

      // Nếu đã chọn đủ 2 điểm
      if (newTempPoints.length === 2) {
        const p1 = newTempPoints[0];
        const p2 = newTempPoints[1];

        // Tính khoảng cách
        const dist = distance(
          point(p1.coord4326),
          point(p2.coord4326),
          { units: "kilometers" }
        );

        // Tạo object lưu thông tin line
        const newLine = {
          id: Date.now(),
          point1: p1,
          point2: p2,
          distance: dist.toFixed(2),
        };

        // Thêm vào list
        setLineList((prev) => [...prev, newLine]);

        // Reset điểm tạm và tắt chế độ vẽ
        setTempPoints([]);
        setIsDrawing(false);

        console.log("Đã tạo line:", newLine);
      }
    };

    map.on("click", handleClick);

    return () => {
      map.un("click", handleClick);
    };
  }, [isDrawing, mapInstance, tempPoints]);

  // Vẽ tất cả các line từ lineList
  useEffect(() => {
    if (!vectorLayerRef.current) return;

    const vectorSource = vectorLayerRef.current.getSource();
    
    // Xóa tất cả features cũ
    vectorSource.clear();

    // Vẽ lại tất cả line từ list
    lineList.forEach((line) => {
      // Vẽ marker 1
      const marker1 = new Feature({
        geometry: new Point(line.point1.coord3857),
      });
      marker1.setStyle(
        new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({ color: "#ef4444" }),
            stroke: new Stroke({ color: "#fff", width: 2 }),
          }),
        })
      );

      // Vẽ marker 2
      const marker2 = new Feature({
        geometry: new Point(line.point2.coord3857),
      });
      marker2.setStyle(
        new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({ color: "#ef4444" }),
            stroke: new Stroke({ color: "#fff", width: 2 }),
          }),
        })
      );

      // Vẽ line
      const lineFeature = new Feature({
        geometry: new LineString([
          line.point1.coord3857,
          line.point2.coord3857,
        ]),
      });
      lineFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: "#3b82f6",
            width: 2,
            lineDash: [10, 5],
          }),
          text: new Text({
            text: `${line.distance} km`,
            font: "bold 14px Arial",
            fill: new Fill({ color: "#ffffff" }),
            backgroundFill: new Fill({ color: "#3b82f6" }),
            backgroundStroke: new Stroke({ color: "#1e40af", width: 1 }),
            padding: [4, 8, 4, 8],
            offsetY: -15,
          }),
        })
      );

      vectorSource.addFeature(marker1);
      vectorSource.addFeature(marker2);
      vectorSource.addFeature(lineFeature);
    });
  }, [lineList]);

  // Hàm bắt đầu vẽ
  const startDrawing = () => {
    setTempPoints([]);
    setIsDrawing(true);
  };

  // Hàm hủy vẽ
  const cancelDrawing = () => {
    setTempPoints([]);
    setIsDrawing(false);
  };

  // Hàm xóa 1 line
  const deleteLine = (id) => {
    setLineList((prev) => prev.filter((line) => line.id !== id));
  };

  // Hàm xóa tất cả
  const clearAll = () => {
    setLineList([]);
    setTempPoints([]);
    setIsDrawing(false);
  };

  return (
    <div style={{ padding: "12px" }}>
      <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600" }}>
        Đo khoảng cách giữa 2 điểm
      </h4>

      {/* Nút bắt đầu vẽ */}
      {!isDrawing && (
        <button
          onClick={startDrawing}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#22c55e",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "12px",
          }}
        >
          Bắt đầu vẽ đường mới
        </button>
      )}

      {/* Khi đang vẽ */}
      {isDrawing && (
        <div style={{ marginBottom: "12px" }}>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fef3c7",
              borderRadius: "4px",
              marginBottom: "8px",
              fontSize: "13px",
            }}
          >
            Click 2 điểm trên bản đồ ({tempPoints.length}/2)
          </div>
          <button
            onClick={cancelDrawing}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Hủy
          </button>
        </div>
      )}

      {/* Danh sách các line đã vẽ */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <h5 style={{ margin: 0, fontSize: "13px", fontWeight: "600" }}>
            Danh sách đã đo ({lineList.length})
          </h5>
          {lineList.length > 0 && (
            <button
              onClick={clearAll}
              style={{
                padding: "4px 8px",
                backgroundColor: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "11px",
              }}
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {lineList.length === 0 && (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#999",
              fontSize: "13px",
            }}
          >
            Chưa có đường nào được vẽ
          </div>
        )}

        {lineList.map((line, index) => (
          <div
            key={line.id}
            style={{
              padding: "10px",
              backgroundColor: "#f9f9f9",
              borderRadius: "4px",
              marginBottom: "8px",
              fontSize: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                  Đường {index + 1}
                </div>
                <div style={{ color: "#666" }}>
                  Khoảng cách: <strong>{line.distance} km</strong>
                </div>
                <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                  Điểm 1: [{line.point1.coord4326[0].toFixed(4)},{" "}
                  {line.point1.coord4326[1].toFixed(4)}]
                </div>
                <div style={{ fontSize: "11px", color: "#999" }}>
                  Điểm 2: [{line.point2.coord4326[0].toFixed(4)},{" "}
                  {line.point2.coord4326[1].toFixed(4)}]
                </div>
              </div>
              <button
                onClick={() => deleteLine(line.id)}
                style={{
                  padding: "6px 10px",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                Xoá
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}