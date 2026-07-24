import React from 'react';

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <div style={{ width: 4, height: 16, background: '#2196F3', borderRadius: 2 }} />
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{children}</span>
    </div>
  );
}
