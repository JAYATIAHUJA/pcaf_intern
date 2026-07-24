import React from 'react';

export function DQRadioGroup({
  value, onChange, options
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {options.map(opt => (
        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14, color: '#334155' }}>
          <input
            type="radio"
            name="dq_option"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="radio-accent"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
