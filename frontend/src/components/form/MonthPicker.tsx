import React from 'react';

export function MonthPicker({
  label, value, onChange, required
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="field-label">
        {label}
        {required && <span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span>}
      </label>
      <input
        type="month"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="field-input"
      />
    </div>
  );
}
