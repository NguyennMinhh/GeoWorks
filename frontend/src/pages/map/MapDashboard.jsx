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
          className="w-32 h-12 m-2 bg-red-400 text-white rounded-md z-1001"
          onClick={() => setShowDashboard(false)}>
          {'Tắt Dashboard'}
        </button>
      </div>
      <div>Thanh tìm kiếm Tools (W.I.P)</div>
      <ToolsList />
    </div>
  );
}
