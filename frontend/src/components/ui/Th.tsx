import React from 'react';

export function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th style={{
      padding: '8px 10px',
      textAlign: right ? 'right' : 'left',
      fontSize: 11,
      fontWeight: 600,
      color: '#64748B',
      background: '#F8FAFC',
      borderBottom: '1px solid #E2E8F0',
      whiteSpace: 'nowrap'
    }}>
      {children}
    </th>
  );
}
