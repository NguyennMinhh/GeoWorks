import { useEffect, useRef, useState, createContext } from 'react';
import { Map, View, Feature } from "ol";
import TileLayer from "ol/layer/Tile.js";
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { switchLayerVisible } from '../../hooks/useMapLayers'
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import { geocodeGoong } from '../../api';

import MapDashboard from './MapDashboard';

export const MapContext = createContext(null);
export const ToolsContext = createContext(null);

export default function BaseMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layersRef = useRef({});

  const [currentLayer, setCurrentLayer] = useState('osm');
  const [query, setQuery] = useState('')
  const [zoomLevel, setZoomLevel] = useState(10)
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  useEffect(() => {
    // Layer Satellite của Esri
    const esriLayer = new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      }),
      properties: { name: 'satellite' },
      visible: false,
    });

    // Layer Generic của OSM
    const osmLayer = new TileLayer({
      source: new OSM(),
      properties: { name: 'osm' },
      visible: true
    });

    // Tạo một layer persistent để vẽ các feature (giữ khi component tool unmount)
    const drawingSource = new VectorSource();
    const drawingLayer = new VectorLayer({
      source: drawingSource,
      zIndex: 1000,
    });

    // Lưu reference
    layersRef.current = { osmLayer, esriLayer, drawingLayer, drawingSource };

    mapInstance.current = new Map({
      target: mapRef.current,
      zIndex: 0,
      layers: [osmLayer, esriLayer, drawingLayer],
      view: new View({
        center: fromLonLat([105.8342, 21.0278]),
        zoom: 6,
      }),
    });

    return () => mapInstance.current.setTarget(null);
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    let targetLayer;
    if (currentLayer === 'osm') {
      targetLayer = layersRef.current.osmLayer;
    } else if (currentLayer === 'satellite') {
      targetLayer = layersRef.current.esriLayer;
    }
    switchLayerVisible(mapInstance.current, targetLayer);
  }, [currentLayer])

  async function handleSearch(e) {
    if (e && e.preventDefault) e.preventDefault();
    const q = query && query.trim();
    if (!q) return;
    try {
      const result = await geocodeGoong(q);
      if (!result) {
        alert('Không tìm thấy kết quả');
        return;
      }

      const coords = fromLonLat([result.lon, result.lat]);
      mapInstance.current.getView().animate({ center: coords, zoom: zoomLevel, duration: 600 });

      const source = layersRef.current?.drawingSource;
      if (!source) return;

      // Đang học đến đây:
      // Xoá mark tìm kiếm cũ (tạm thời)
      source.getFeatures()
        .filter((f) => f.get('type') === 'search_marker')
        .forEach((f) => source.removeFeature(f));

      // Tạo mark mới tại vị trí tìm kiếm
      const marker = new Feature({
        geometry: new Point(coords),
      });
      marker.set('type', 'search_marker');
      marker.setStyle(
        new Style({
          image: new Circle({
            radius: 7,
            fill: new Fill({ color: '#ef4444' }), // đỏ
            stroke: new Stroke({ color: '#ffffff', width: 2 }), // viền trắng
          }),
        })
      );
      source.addFeature(marker);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tìm kiếm');
    }
  }

  return (
    <MapContext.Provider value={{ mapInstance, setCurrentLayer, currentLayer, handleSearch, drawingLayer: layersRef.current?.drawingLayer, drawingSource: layersRef.current?.drawingSource }}>
      <ToolsContext.Provider value={{ query, setQuery, zoomLevel, setZoomLevel, showDashboard, setShowDashboard, selectedTool, setSelectedTool }}>
        <div style={{ position: 'relative', width: '100%', height: '94vh' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
          <div className="absolute top-4 left-16 flex">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input 
                type='text'
                placeholder='Tìm kiếm địa điểm...'
                value={query}
                className="px-3 py-2 text-sm w-64 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => {setQuery(e.target.value)}}
              />
              <input
                type='number'
                value={zoomLevel}
                max={99}
                min={1}
                className="px-3 py-2 w-20 rounded border border-gray-300 focus:outline-none"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value < 1 || value > 99) return;
                  setZoomLevel(value)}}
              />
              <button type='submit' className="px-3 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700">Tìm</button>
            </form>
          </div>

          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            zIndex: 1000,
            display: 'flex',
          }}>
            <button 
              className='bg-gray-500 rounded-md w-32 h-12 m-2 text-white'
              onClick={() => setShowDashboard(true)}>
              {'Hiện Dashboard'}
            </button>
            
              <MapDashboard/>
          </div>
        </div>
      </ToolsContext.Provider>
    </MapContext.Provider>
  )
}