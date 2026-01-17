import { useEffect, useRef, useState, createContext } from 'react';
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile.js";
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ.js';
import { switchLayerVisible, searchAndZoom } from '../../hooks/useMapLayers'
import { fromLonLat } from 'ol/proj';

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
      visible: false
    });

    // Layer Generic của OSM
    const osmLayer = new TileLayer({
      source: new OSM(),
      visible: true
    });

    // Lưu reference
    layersRef.current = { osmLayer, esriLayer };

    mapInstance.current = new Map({
      target: mapRef.current,
      zIndex: 0,
      layers: [osmLayer, esriLayer],
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
      searchAndZoom(q, mapInstance.current, zoomLevel)
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tìm kiếm');
    }
  }

  return (
    <MapContext.Provider value={{ mapInstance, setCurrentLayer, currentLayer, handleSearch }}>
      <ToolsContext.Provider value={{ query, setQuery, zoomLevel, setZoomLevel, showDashboard, setShowDashboard, selectedTool, setSelectedTool }}>
        <div style={{ position: 'relative', width: '100%', height: '94vh' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '4rem',
            display: 'flex',
          }}>
            <form onSubmit={handleSearch}>
              <input 
                type='text'
                placeholder='Tìm kiếm địa điểm'
                value={query}
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  width: '220px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  outline: 'none'
                }}
                onChange={(e) => {setQuery(e.target.value)}}
              ></input>
              <input
                type='number'
                value={zoomLevel}
                max={99}
                min={1}
                style={{
                  // marginLeft: '8px',
                  padding: '8px 12px',
                  // fontSize: '14px',
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value < 1 || value > 99) return;
                  setZoomLevel(Number(value))}}
              ></input>
              <button type='submit' style={{ display: 'none' }}>Tìm kiếm</button>
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
              style={{ 
                width: '8rem',
                height: '3rem',
              }}
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