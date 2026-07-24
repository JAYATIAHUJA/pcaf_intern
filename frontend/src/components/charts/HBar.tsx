import React from 'react';

export function HBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ background: '#F1F5F9', borderRadius: 3, height: 7, width: '100%' }}>
      <div style={{ background: color, borderRadius: 3, height: '100%', width: `${pct}%` }} />
    </div>
  );
}
