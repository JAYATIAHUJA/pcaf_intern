import React from 'react';
import { IconCar, IconChartBar } from '@tabler/icons-react';

interface MotorVehicleKpisProps {
  totalEmissions: number;
}

export function MotorVehicleKpis({ totalEmissions }: MotorVehicleKpisProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
      <div className="kpi-card">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="icon-box icon-box-md icon-box-emerald">
            <IconCar size={20} className="text-emerald-600" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Total Emission</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>
              {totalEmissions.toFixed(1)} <span style={{ fontSize: 14, fontWeight: 400, color: "#64748b" }}>tCO2e</span>
            </div>
          </div>
        </div>
      </div>
      <div className="kpi-card">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="icon-box icon-box-md icon-box-sky">
            <IconChartBar size={20} className="text-sky-600" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Loan Emission Progress</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>
              70 <span style={{ fontSize: 14, fontWeight: 400, color: "#64748b" }}>%</span>
            </div>
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  );
}
