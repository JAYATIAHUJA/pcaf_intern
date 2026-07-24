import React from 'react';

export function Select({
  label, value, onChange, options, required
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="field-label">
        {label}
        {required && <span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span>}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)} className="field-select">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
