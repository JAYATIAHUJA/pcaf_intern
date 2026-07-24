import React from 'react';

export function FormRow({ cols = 3, children }: { cols?: number; children: React.ReactNode }) {
  return (
    <div className="form-row" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {children}
    </div>
  );
}
