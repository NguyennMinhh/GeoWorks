import { fromLonLat } from "ol/proj";
import { geocodeGoong } from "../api";
import { transformExtent } from "ol/proj";

// Hàm chuyển đổi visible:
export const switchLayerVisible = (mapInstance, targetLayer) => {
    if(!mapInstance || !targetLayer) return;

    mapInstance.getLayers().forEach((layer) => {
        // ✅ Chỉ ẩn các basemap layer, KHÔNG ẨN layer vẽ
        const layerName = layer.get('name');
        if (layerName === 'osm' || layerName === 'satellite') {
        layer.setVisible(false);
        }
    });
    targetLayer?.setVisible(true);
};

export async function searchAndZoom(query, map, zoomLevel) {
    const result = await geocodeGoong(query);
    if(!result) {
        alert('Không tìm thấy kết quả');
        return;
    }

    const coords = fromLonLat([result.lon, result.lat]);
    map.getView().animate({ center: coords, zoom: zoomLevel, duration: 600 });
}