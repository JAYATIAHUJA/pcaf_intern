import React from 'react';

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E8ECF0',
      borderRadius: 8,
      padding: '16px 18px',
      ...style,
    }}>
      {children}
    </div>
  );
}
