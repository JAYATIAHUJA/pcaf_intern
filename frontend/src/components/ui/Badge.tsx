import React from 'react';
import type { DataQualityScore } from '../../../../common/types';

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
        DQ{score} - {DQ_LABELS[score]}
      </span>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const inlineStyles: Record<string, { bg: string; color: string }> = {
    Draft:     { bg: '#F1F5F9', color: '#64748B' },
    Submitted: { bg: '#EFF6FF', color: '#2563EB' },
    Approved:  { bg: '#ECFDF5', color: '#059669' },
  };

  if (inlineStyles[status]) {
    const s = inlineStyles[status];
    return (
      <span style={{
        background: s.bg,
        color: s.color,
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        display: 'inline-block',
      }}>
        {status}
      </span>
    );
  }

  const cls =
    status === 'Approved'            ? 'badge badge-success' :
    status === 'Submitted & Pending' ? 'badge badge-info' :
    status === 'Active'              ? 'badge badge-success' :
    status === 'Pending for Capture' ? 'badge badge-warning' :
    status === 'Rejected'            ? 'badge badge-danger' :
    'badge badge-neutral';

  return <span className={cls}>{status}</span>;
}
