import React from 'react';

export function Textarea({
  label, value, onChange, rows = 3, required
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="field-label">
        {label}
        {required && <span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span>}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        className="field-textarea"
      />
    </div>
  );
}
