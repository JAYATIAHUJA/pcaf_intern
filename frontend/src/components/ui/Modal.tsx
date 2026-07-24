import React from 'react';
import { IconX } from '@tabler/icons-react';

export function Modal({
  title, onClose, children, footer, size = 'lg'
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizeClass = {
    sm: 'modal-box-sm',
    md: 'modal-box-md',
    lg: 'modal-box-lg',
    xl: 'modal-box-xl'
  }[size];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal-box ${sizeClass}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>{title}</h3>
          <button onClick={onClose} className="btn-icon"><IconX size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
