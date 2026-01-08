import { useEffect, useRef } from 'react';
import { Map, View } from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import OSM from 'ol/source/OSM.js';

export default function BaseMap() {
  useEffect(() => {
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  }, []);



  return (
    <div id="map" style="width: 100%, height: 94vh"></div>
  )
}

