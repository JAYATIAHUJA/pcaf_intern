import React from 'react';

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
