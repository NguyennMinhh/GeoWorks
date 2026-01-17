import { useContext, useState } from "react";
import { MapContext, ToolsContext } from "./BaseMap";
import BaseMapSwitcher from "./dashboard/BaseMapSwitcher";
import ToolsList from "./tools/ToolsList";

export default function MapDashboard() {
  const { showDashboard, setShowDashboard } = useContext(ToolsContext);

  if (!showDashboard) return null;

  return (
    <div style={{ position: 'absolute', top: 0, right: 0, height: '94vh', background: 'lightgray', zIndex: 101, width: '300px', overflowY: 'auto' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <BaseMapSwitcher />
        <button 
          style={{ 
            zIndex: 1001,
            width: '8rem',
            height: '3rem',
            marginRight: '8px',
            marginTop: '8px',
          }}
          onClick={() => setShowDashboard(false)}>
          {'Tắt Dashboard'}
        </button>
      </div>
      <div>Thanh tìm kiếm Tools (W.I.P)</div>
      <ToolsList />
    </div>
  );
}
