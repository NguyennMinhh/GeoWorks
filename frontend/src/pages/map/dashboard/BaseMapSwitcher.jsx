import { useState, useContext } from "react";
import { MapContext, ToolsContext } from "../BaseMap";

export default function BaseMapSwitcher() {
  const { setCurrentLayer, currentLayer } = useContext(MapContext);
  const { showDashboard } = useContext(ToolsContext);
  const [open, setOpen] = useState(false);

  if (!showDashboard) return null;

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)}>
        {currentLayer === 'osm' ? 'OSM' : 'Satellite'} ▾
      </button>

      {open && (
        <div style={{ background: 'gray' }}>
            <div onClick={() => { setCurrentLayer('osm'); setOpen(false); }}>
                OSM
            </div>
            <div onClick={() => { setCurrentLayer('satellite'); setOpen(false); }}>
                Satellite
            </div>
        </div>
      )}
    </div>
  );
}
