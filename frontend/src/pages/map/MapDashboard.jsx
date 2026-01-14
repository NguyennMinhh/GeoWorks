import { useContext } from "react";
import { MapContext, ToolsContext } from "./BaseMap";
import BaseMapSwitcher from "./dashboard/BaseMapSwitcher";

export default function MapDashboard() {
  const { showDashboard } = useContext(ToolsContext);

  if (!showDashboard) return null;

  return (
    <div style={{ position: 'absolute', top: 0, right: 0, height: '50vh', background: 'lightgray', zIndex: 101, width: '300px', overflowY: 'auto' }}>
        
        <div>
            <BaseMapSwitcher />
        </div>
    </div>
  );
}
