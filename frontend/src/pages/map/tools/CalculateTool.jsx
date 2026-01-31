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

export function StraightDistanceTool() {
  const { mapInstance, drawingLayer, drawingSource } = useContext(MapContext);
  const { selectedTool } = useContext(ToolsContext);

  // State để lưu danh sách các đường đã đo
  const [lineList, setLineList] = useState([]);
  
  // State để bật/tắt chế độ vẽ
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Lưu 2 điểm đang chọn (dùng state để UI cập nhật)
  const [tempPoints, setTempPoints] = useState([]);
  
  // Ref để lưu layer
  const vectorLayerRef = useRef(null);

  // Sử dụng layer persistent từ MapContext (không remove khi unmount)
  useEffect(() => {
    if (!mapInstance.current || selectedTool !== "get_straight_distance") return;
    // Gán layer persistent vào ref để các effect sau dùng chung
    vectorLayerRef.current = drawingLayer;
  }, [selectedTool, mapInstance, drawingLayer]);

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
    <div className="p-3 space-y-3">
      <h4 className="text-lg font-bold">Đo khoảng cách giữa 2 điểm</h4>

      {!isDrawing && (
        <button
          onClick={startDrawing}
          className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
        >
          Bắt đầu vẽ đường mới
        </button>
      )}

      {isDrawing && (
        <div className="mb-3">
          <div className="bg-yellow-200 p-2 rounded mb-2 text-sm">Click 2 điểm trên bản đồ ({tempPoints.length}/2)</div>
          <button onClick={cancelDrawing} className="px-2 py-1 bg-gray-200 rounded">Hủy</button>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center">
          <h5 className="text-md font-medium">Danh sách đã đo ({lineList.length})</h5>
          {lineList.length > 0 && (
            <button onClick={clearAll} className="bg-red-500 text-white px-2 py-1 rounded">Xóa tất cả</button>
          )}
        </div>

        {lineList.length === 0 && (
          <div className="text-sm text-gray-600">Chưa có đường nào được vẽ</div>
        )}

        {lineList.map((line, index) => (
          <div key={line.id} className="border p-3 rounded mb-2">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">Đường {index + 1}</div>
                <div className="text-sm">Khoảng cách: <strong>{line.distance} km</strong></div>
                <div className="text-xs">Điểm 1: [{line.point1.coord4326[0].toFixed(4)}, {line.point1.coord4326[1].toFixed(4)}]</div>
                <div className="text-xs">Điểm 2: [{line.point2.coord4326[0].toFixed(4)}, {line.point2.coord4326[1].toFixed(4)}]</div>
              </div>
              <button onClick={() => deleteLine(line.id)} className="bg-red-500 text-white px-2 py-1 rounded">Xoá</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GetMoveWayTool() {
  const { mapInstance, drawingLayer, drawingSource } = useContext(MapContext);
  const { selectedTool } = useContext(ToolsContext);

  // State để lưu danh sách các đường đã tìm
  const [routeList, setRouteList] = useState([]);
  
  // State để bật/tắt chế độ vẽ
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Lưu 2 điểm đang chọn (dùng state để UI cập nhật)
  const [tempPoints, setTempPoints] = useState([]);
  
  // Ref để lưu layer
  const vectorLayerRef = useRef(null);

  // Sử dụng layer persistent từ MapContext (không remove khi unmount)
  useEffect(() => {
    if (!mapInstance.current || selectedTool !== "get_move_way") return;
    vectorLayerRef.current = drawingLayer;
  }, [selectedTool, mapInstance, drawingLayer]);

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

        // Tạo object lưu thông tin route
        const newRoute = {
          id: Date.now(),
          point1: p1,
          point2: p2,
          distance: dist.toFixed(2),
        };

        // Thêm vào list
        setRouteList((prev) => [...prev, newRoute]);

        // Reset điểm tạm và tắt chế độ vẽ
        setTempPoints([]);
        setIsDrawing(false);

        console.log("Đã tạo route:", newRoute);
      }
    };

    map.on("click", handleClick);

    return () => {
      map.un("click", handleClick);
    };
  }, [isDrawing, mapInstance, tempPoints]);

  // Vẽ tất cả các route từ routeList
  useEffect(() => {
    if (!vectorLayerRef.current) return;

    const vectorSource = vectorLayerRef.current.getSource();
    
    // Xóa tất cả features cũ
    vectorSource.clear();

    // Vẽ lại tất cả route từ list
    routeList.forEach((route) => {
      // Vẽ marker điểm đầu
      const markerStart = new Feature({
        geometry: new Point(route.point1.coord3857),
      });
      markerStart.setStyle(
        new Style({
          image: new Circle({
            radius: 7,
            fill: new Fill({ color: "#10b981" }),
            stroke: new Stroke({ color: "#fff", width: 2 }),
          }),
          text: new Text({
            text: "A",
            font: "bold 12px Arial",
            fill: new Fill({ color: "#fff" }),
            offsetY: -12,
          }),
        })
      );

      // Vẽ marker điểm cuối
      const markerEnd = new Feature({
        geometry: new Point(route.point2.coord3857),
      });
      markerEnd.setStyle(
        new Style({
          image: new Circle({
            radius: 7,
            fill: new Fill({ color: "#ef4444" }),
            stroke: new Stroke({ color: "#fff", width: 2 }),
          }),
          text: new Text({
            text: "B",
            font: "bold 12px Arial",
            fill: new Fill({ color: "#fff" }),
            offsetY: -12,
          }),
        })
      );

      // Vẽ route (đường nối 2 điểm)
      const routeFeature = new Feature({
        geometry: new LineString([
          route.point1.coord3857,
          route.point2.coord3857,
        ]),
      });
      routeFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: "#f97316",
            width: 3,
          }),
          text: new Text({
            text: `${route.distance} km`,
            font: "bold 14px Arial",
            fill: new Fill({ color: "#ffffff" }),
            backgroundFill: new Fill({ color: "#f97316" }),
            backgroundStroke: new Stroke({ color: "#c2410c", width: 1 }),
            padding: [4, 8, 4, 8],
            offsetY: -15,
          }),
        })
      );

      vectorSource.addFeature(markerStart);
      vectorSource.addFeature(markerEnd);
      vectorSource.addFeature(routeFeature);
    });
  }, [routeList]);

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

  // Hàm xóa 1 route
  const deleteRoute = (id) => {
    setRouteList((prev) => prev.filter((route) => route.id !== id));
  };

  // Hàm xóa tất cả
  const clearAll = () => {
    setRouteList([]);
    setTempPoints([]);
    setIsDrawing(false);
  };

  return (
    <div className="p-3 space-y-3">
      <h4 className="text-lg font-bold">Tìm đường đi giữa 2 điểm</h4>

      {!isDrawing && (
        <button onClick={startDrawing} className="bg-blue-500 text-white px-3 py-1 rounded mb-2">
          Bắt đầu tìm đường đi mới
        </button>
      )}

      {isDrawing && (
        <div className="mb-3">
          <div className="bg-yellow-200 p-2 rounded mb-2 text-sm">Click 2 điểm trên bản đồ ({tempPoints.length}/2)</div>
          <button onClick={cancelDrawing} className="px-2 py-1 bg-gray-200 rounded">Hủy</button>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center">
          <h5 className="text-md font-medium">Danh sách đường đi ({routeList.length})</h5>
          {routeList.length > 0 && (
            <button onClick={clearAll} className="bg-red-500 text-white px-2 py-1 rounded">Xóa tất cả</button>
          )}
        </div>

        {routeList.length === 0 && <div className="text-sm text-gray-600">Chưa có đường đi nào được tìm</div>}

        {routeList.map((route, index) => (
          <div key={route.id} className="border p-3 rounded mb-2">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">Đường đi {index + 1}</div>
                <div className="text-sm">Khoảng cách: <strong>{route.distance} km</strong></div>
                <div className="text-xs">Điểm A: [{route.point1.coord4326[0].toFixed(4)}, {route.point1.coord4326[1].toFixed(4)}]</div>
                <div className="text-xs">Điểm B: [{route.point2.coord4326[0].toFixed(4)}, {route.point2.coord4326[1].toFixed(4)}]</div>
              </div>
              <button onClick={() => deleteRoute(route.id)} className="bg-red-500 text-white px-2 py-1 rounded">Xoá</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}