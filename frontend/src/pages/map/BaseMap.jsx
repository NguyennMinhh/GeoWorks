import { useEffect, useRef, useState } from 'react';
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile.js";
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ.js';
import { switchLayerVisible, searchAndZoom } from '../../hooks/useMapLayers'
import { fromLonLat } from 'ol/proj';

export default function BaseMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layersRef = useRef({});
  const [currentLayer, setCurrentLayer] = useState('osm');
  const [query, setQuery] = useState('')
  const [zoomLevel, setZoomLevel] = useState(10)

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
    <div style={{ position: 'relative', width: '100%', height: '94vh' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px'
      }}>
        <form onSubmit={handleSearch}>
          <input 
            type='text'
            placeholder='Tìm kiếm địa điểm'
            value={query}
            onChange={(e) => {setQuery(e.target.value)}}
          ></input>
          <input
            type='number'
            value={zoomLevel}
            max={99}
            min={1}
            onChange={(e) => {
              const value = e.target.value;
              if (value < 1 || value > 99) return;
              setZoomLevel(Number(value))}}
            style={{
              width:'4ch',
              textAlign: 'center'
            }}
          ></input>
          <button type='submit'>Tìm kiếm</button>
        </form>
        <button
          onClick={() => setCurrentLayer('osm')}
          style={{
            padding: '10px 20px',
            backgroundColor: currentLayer === 'osm' ? '#4CAF50' : '#ddd',
            color: currentLayer === 'osm' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          OSM
        </button>
        <button
          onClick={() => setCurrentLayer('satellite')}
          style={{
            padding: '10px 20px',
            backgroundColor: currentLayer === 'satellite' ? '#4CAF50' : '#ddd',
            color: currentLayer === 'satellite' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Satellite
        </button>
      </div>
    </div>
  )
}