import React from 'react';

export function SettingsSectionCard({ 
  title, icon, children 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode 
}) {
  return (
    <div className="kpi-card">
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 10, 
        marginBottom: 20, 
        paddingBottom: 12, 
        borderBottom: "1px solid #f1f5f9" 
      }}>
        <div className="icon-box icon-box-sm icon-box-sky">{icon}</div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}
