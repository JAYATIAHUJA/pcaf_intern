import React from 'react';

export function StatCard({
  label, value, sub, accent = false,
}: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div style={{
      background: accent ? '#0F1E2E' : '#FFFFFF',
      border: '1px solid',
      borderColor: accent ? '#0F1E2E' : '#E2E8F0',
      borderRadius: 10,
      padding: '18px 22px',
      flex: 1,
      minWidth: 160,
    }}>
      <div style={{ fontSize: 12, color: accent ? '#94A3B8' : '#64748B', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent ? '#FFFFFF' : '#0F172A', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: accent ? '#64748B' : '#94A3B8', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
