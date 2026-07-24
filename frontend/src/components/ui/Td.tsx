import React from 'react';

export function Td({ children, right, mono, bold }: { children: React.ReactNode; right?: boolean; mono?: boolean; bold?: boolean }) {
  return (
    <td style={{
      padding: '9px 10px',
      textAlign: right ? 'right' : 'left',
      fontSize: 12,
      color: bold ? '#0F172A' : '#374151',
      fontFamily: mono ? 'monospace' : 'inherit',
      fontWeight: bold ? 600 : 400,
      borderBottom: '1px solid #F1F5F9'
    }}>
      {children}
    </td>
  );
}
