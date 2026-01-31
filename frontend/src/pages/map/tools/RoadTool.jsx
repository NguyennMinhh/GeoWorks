// export function GetMoveWayTool() {
//   const { mapInstance } = useContext(MapContext);
//   const { selectedTool } = useContext(ToolsContext);

//   // State để lưu danh sách các đường đã tìm
//   const [routeList, setRouteList] = useState([]);
  
//   // State để bật/tắt chế độ vẽ
//   const [isDrawing, setIsDrawing] = useState(false);
  
//   // Lưu 2 điểm đang chọn (dùng state để UI cập nhật)
//   const [tempPoints, setTempPoints] = useState([]);
  
//   // Ref để lưu layer
//   const vectorLayerRef = useRef(null);

//   // Khởi tạo layer khi component mount
//   useEffect(() => {
//     if (!mapInstance.current || selectedTool !== "get_move_way") return;

//     const map = mapInstance.current;

//     // Tạo layer để vẽ
//     const vectorSource = new VectorSource();
//     const vectorLayer = new VectorLayer({
//       source: vectorSource,
//     });

//     map.addLayer(vectorLayer);
//     vectorLayerRef.current = vectorLayer;

//     return () => {
//       if (vectorLayerRef.current) {
//         map.removeLayer(vectorLayerRef.current);
//         vectorLayerRef.current = null;
//       }
//     };
//   }, [selectedTool, mapInstance]);

//   // Xử lý click trên bản đồ khi đang ở chế độ vẽ
//   useEffect(() => {
//     if (!mapInstance.current || !isDrawing) return;

//     const map = mapInstance.current;

//     const handleClick = (e) => {
//       const coord3857 = e.coordinate;
//       const coord4326 = transform(coord3857, "EPSG:3857", "EPSG:4326");

//       // Thêm điểm vào mảng
//       const newTempPoints = [
//         ...tempPoints,
//         {
//           coord3857: coord3857,
//           coord4326: coord4326,
//         }
//       ];

//       setTempPoints(newTempPoints);

//       console.log("Đã chọn điểm:", coord4326);

//       // Nếu đã chọn đủ 2 điểm
//       if (newTempPoints.length === 2) {
//         const p1 = newTempPoints[0];
//         const p2 = newTempPoints[1];

//         // Tính khoảng cách
//         const dist = distance(
//           point(p1.coord4326),
//           point(p2.coord4326),
//           { units: "kilometers" }
//         );

//         // Tạo object lưu thông tin route
//         const newRoute = {
//           id: Date.now(),
//           point1: p1,
//           point2: p2,
//           distance: dist.toFixed(2),
//         };

//         // Thêm vào list
//         setRouteList((prev) => [...prev, newRoute]);

//         // Reset điểm tạm và tắt chế độ vẽ
//         setTempPoints([]);
//         setIsDrawing(false);

//         console.log("Đã tạo route:", newRoute);
//       }
//     };

//     map.on("click", handleClick);

//     return () => {
//       map.un("click", handleClick);
//     };
//   }, [isDrawing, mapInstance, tempPoints]);

//   // Vẽ tất cả các route từ routeList
//   useEffect(() => {
//     if (!vectorLayerRef.current) return;

//     const vectorSource = vectorLayerRef.current.getSource();
    
//     // Xóa tất cả features cũ
//     vectorSource.clear();

//     // Vẽ lại tất cả route từ list
//     routeList.forEach((route) => {
//       // Vẽ marker điểm đầu
//       const markerStart = new Feature({
//         geometry: new Point(route.point1.coord3857),
//       });
//       markerStart.setStyle(
//         new Style({
//           image: new Circle({
//             radius: 7,
//             fill: new Fill({ color: "#10b981" }),
//             stroke: new Stroke({ color: "#fff", width: 2 }),
//           }),
//           text: new Text({
//             text: "A",
//             font: "bold 12px Arial",
//             fill: new Fill({ color: "#fff" }),
//             offsetY: -12,
//           }),
//         })
//       );

//       // Vẽ marker điểm cuối
//       const markerEnd = new Feature({
//         geometry: new Point(route.point2.coord3857),
//       });
//       markerEnd.setStyle(
//         new Style({
//           image: new Circle({
//             radius: 7,
//             fill: new Fill({ color: "#ef4444" }),
//             stroke: new Stroke({ color: "#fff", width: 2 }),
//           }),
//           text: new Text({
//             text: "B",
//             font: "bold 12px Arial",
//             fill: new Fill({ color: "#fff" }),
//             offsetY: -12,
//           }),
//         })
//       );

//       // Vẽ route (đường nối 2 điểm)
//       const routeFeature = new Feature({
//         geometry: new LineString([
//           route.point1.coord3857,
//           route.point2.coord3857,
//         ]),
//       });
//       routeFeature.setStyle(
//         new Style({
//           stroke: new Stroke({
//             color: "#f97316",
//             width: 3,
//           }),
//           text: new Text({
//             text: `${route.distance} km`,
//             font: "bold 14px Arial",
//             fill: new Fill({ color: "#ffffff" }),
//             backgroundFill: new Fill({ color: "#f97316" }),
//             backgroundStroke: new Stroke({ color: "#c2410c", width: 1 }),
//             padding: [4, 8, 4, 8],
//             offsetY: -15,
//           }),
//         })
//       );

//       vectorSource.addFeature(markerStart);
//       vectorSource.addFeature(markerEnd);
//       vectorSource.addFeature(routeFeature);
//     });
//   }, [routeList]);

//   // Hàm bắt đầu vẽ
//   const startDrawing = () => {
//     setTempPoints([]);
//     setIsDrawing(true);
//   };

//   // Hàm hủy vẽ
//   const cancelDrawing = () => {
//     setTempPoints([]);
//     setIsDrawing(false);
//   };

//   // Hàm xóa 1 route
//   const deleteRoute = (id) => {
//     setRouteList((prev) => prev.filter((route) => route.id !== id));
//   };

//   // Hàm xóa tất cả
//   const clearAll = () => {
//     setRouteList([]);
//     setTempPoints([]);
//     setIsDrawing(false);
//   };

//   return (
//     <div style={{ padding: "12px" }}>
//       <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600" }}>
//         Tìm đường đi giữa 2 điểm
//       </h4>

//       {/* Nút bắt đầu vẽ */}
//       {!isDrawing && (
//         <button
//           onClick={startDrawing}
//           style={{
//             width: "100%",
//             padding: "12px",
//             backgroundColor: "#22c55e",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             fontSize: "14px",
//             fontWeight: "600",
//             marginBottom: "12px",
//           }}
//         >
//           Bắt đầu tìm đường đi mới
//         </button>
//       )}

//       {/* Khi đang vẽ */}
//       {isDrawing && (
//         <div style={{ marginBottom: "12px" }}>
//           <div
//             style={{
//               padding: "12px",
//               backgroundColor: "#fef3c7",
//               borderRadius: "4px",
//               marginBottom: "8px",
//               fontSize: "13px",
//             }}
//           >
//             Click 2 điểm trên bản đồ ({tempPoints.length}/2)
//           </div>
//           <button
//             onClick={cancelDrawing}
//             style={{
//               width: "100%",
//               padding: "8px",
//               backgroundColor: "#ef4444",
//               color: "#fff",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//               fontSize: "13px",
//             }}
//           >
//             Hủy
//           </button>
//         </div>
//       )}

//       {/* Danh sách các route đã tìm */}
//       <div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "8px",
//           }}
//         >
//           <h5 style={{ margin: 0, fontSize: "13px", fontWeight: "600" }}>
//             Danh sách đường đi ({routeList.length})
//           </h5>
//           {routeList.length > 0 && (
//             <button
//               onClick={clearAll}
//               style={{
//                 padding: "4px 8px",
//                 backgroundColor: "#ef4444",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "3px",
//                 cursor: "pointer",
//                 fontSize: "11px",
//               }}
//             >
//               Xóa tất cả
//             </button>
//           )}
//         </div>

//         {routeList.length === 0 && (
//           <div
//             style={{
//               padding: "20px",
//               textAlign: "center",
//               color: "#999",
//               fontSize: "13px",
//             }}
//           >
//             Chưa có đường đi nào được tìm
//           </div>
//         )}

//         {routeList.map((route, index) => (
//           <div
//             key={route.id}
//             style={{
//               padding: "10px",
//               backgroundColor: "#f9f9f9",
//               borderRadius: "4px",
//               marginBottom: "8px",
//               fontSize: "12px",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <div>
//                 <div style={{ fontWeight: "600", marginBottom: "4px" }}>
//                   Đường đi {index + 1}
//                 </div>
//                 <div style={{ color: "#666" }}>
//                   Khoảng cách: <strong>{route.distance} km</strong>
//                 </div>
//                 <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
//                   Điểm A: [{route.point1.coord4326[0].toFixed(4)},{" "}
//                   {route.point1.coord4326[1].toFixed(4)}]
//                 </div>
//                 <div style={{ fontSize: "11px", color: "#999" }}>
//                   Điểm B: [{route.point2.coord4326[0].toFixed(4)},{" "}
//                   {route.point2.coord4326[1].toFixed(4)}]
//                 </div>
//               </div>
//               <button
//                 onClick={() => deleteRoute(route.id)}
//                 style={{
//                   padding: "6px 10px",
//                   backgroundColor: "#ef4444",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "3px",
//                   cursor: "pointer",
//                   fontSize: "11px",
//                 }}
//               >
//                 Xoá
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }