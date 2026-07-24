import React from 'react';

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
