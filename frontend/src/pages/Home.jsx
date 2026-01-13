import { transform } from "ol/proj";
import { Point } from "ol/geom";

export default function Home() {
    
    // Phải đổi toạ độ từ hệ toạ độ địa lý sang hệ toạ độ mặt phẳng trước
    const hanoiMercator = new Point(
        transform([105.8342, 21.0287], 'EPSG:4326', 'EPSG:3857')
    );
    console.log(`hanoiMercator: ${hanoiMercator.getCoordinates()}`);

    return (
        <div>Home</div>
    )
}