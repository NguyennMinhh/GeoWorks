import { fromLonLat } from "ol/proj";
import { geocodeNominatim } from "../api";
import { transformExtent } from "ol/proj";

// Hàm chuyển đổi visible:
export const switchLayerVisible = (mapInstance, targetLayer) => {
    if(!mapInstance || !targetLayer) return;

    mapInstance.getLayers().forEach((layer) => {
        layer.setVisible(false);
    });
    targetLayer?.setVisible(true);
};

export async function searchAndZoom(query, map, zoomLevel) {
    const result = await geocodeNominatim(query);
    if(!result) {
        alert('Không tìm thấy kết quả');
        return;
    }

    const coords = fromLonLat([result.lon, result.lat]);
    map.getView().animate({ center: coords, zoom: zoomLevel, duration: 600 });
}