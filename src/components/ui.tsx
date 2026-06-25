import React from 'react';
import type { DataQualityScore } from '../constants/mockData';

// ─── Data Quality Score Badge (PCAF signature element) ────────────────────────
const DQ_LABELS: Record<DataQualityScore, string> = {
  1: 'Verified',
  2: 'Reported',
  3: 'Estimated',
  4: 'Proxy',
  5: 'Default',
};
const DQ_COLORS: Record<DataQualityScore, string> = {
  1: '#10B981',
  2: '#34D399',
  3: '#F59E0B',
  4: '#F97316',
  5: '#EF4444',
};

export function DataQualityBadge({ score }: { score: DataQualityScore }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {([1, 2, 3, 4, 5] as DataQualityScore[]).map((i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: i <= score ? DQ_COLORS[score] : '#E2E8F0',
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 10, color: DQ_COLORS[score], fontWeight: 600, letterSpacing: '0.04em' }}>
        DQ{score} · {DQ_LABELS[score]}
      </span>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Draft:     { bg: '#F1F5F9', color: '#64748B' },
  Submitted: { bg: '#EFF6FF', color: '#2563EB' },
  Approved:  { bg: '#ECFDF5', color: '#059669' },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE['Draft'];
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '2px 8px', borderRadius: 4,
      fontSize: 12, fontWeight: 600,
    }}>
      {status}
    </span>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────
export function PageHeader({
  title, subtitle, action,
}: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
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

// ─── Section Card ─────────────────────────────────────────────────────────────
export function SectionCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 10,
      padding: '20px 24px',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Primary Button ───────────────────────────────────────────────────────────
export function Btn({
  children, onClick, variant = 'primary', small = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  small?: boolean;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary:   { background: '#10B981', color: '#fff', border: 'none' },
    secondary: { background: '#fff', color: '#374151', border: '1px solid #D1D5DB' },
    danger:    { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' },
  };
  return (
    <button
      onClick={onClick}
      style={{
        ...styles[variant],
        padding: small ? '5px 12px' : '8px 16px',
        borderRadius: 6,
        fontSize: small ? 12 : 13,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {children}
    </button>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#F8FAFC' }}>
            {headers.map((h) => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function TR({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      style={{ borderBottom: '1px solid #F1F5F9', cursor: onClick ? 'pointer' : 'default' }}
      onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLElement).style.background = '#F8FAFC'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
    >
      {children}
    </tr>
  );
}

export function TD({ children, mono = false }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td style={{ padding: '11px 14px', color: '#334155', fontFamily: mono ? 'monospace' : 'inherit' }}>
      {children}
    </td>
  );
}
