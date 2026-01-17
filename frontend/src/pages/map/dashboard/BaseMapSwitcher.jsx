import { useState, useContext } from "react";
import { MapContext, ToolsContext } from "../BaseMap";

export default function BaseMapSwitcher() {
  const { setCurrentLayer, currentLayer } = useContext(MapContext);
  const { showDashboard } = useContext(ToolsContext);
  const [open, setOpen] = useState(false);

  if (!showDashboard) return null;

  return (
    <div style={{ position: 'relative', padding: '12px' }}>
      <button 
        onClick={() => setOpen(!open)}
        style={{
          padding: '10px 16px',
          fontSize: '14px',
          fontWeight: '500',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
      >
        {currentLayer === 'osm' ? 'OSM' : 'Satellite'} ▾
      </button>

      {open && (
        <div style={{ 
          position: 'absolute',
          top: '100%',
          left: '12px',
          right: '12px',
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginTop: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          zIndex: 1000
        }}>
          <div 
            onClick={() => { setCurrentLayer('osm'); setOpen(false); }}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              backgroundColor: currentLayer === 'osm' ? '#e8f5e9' : '#fff',
              borderBottom: '1px solid #f0f0f0',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => currentLayer !== 'osm' && (e.target.style.backgroundColor = '#f9f9f9')}
            onMouseLeave={(e) => currentLayer !== 'osm' && (e.target.style.backgroundColor = '#fff')}
          >
            OSM
          </div>
          <div
            onClick={() => { setCurrentLayer('satellite'); setOpen(false); }}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              backgroundColor: currentLayer === 'satellite' ? '#e8f5e9' : '#fff',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => currentLayer !== 'satellite' && (e.target.style.backgroundColor = '#f9f9f9')}
            onMouseLeave={(e) => currentLayer !== 'satellite' && (e.target.style.backgroundColor = '#fff')}
          >
            Satellite
          </div>
        </div>
      )}
    </div>
  );
}
