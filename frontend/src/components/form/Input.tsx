import React from 'react';

export function Input({
  label, value, onChange, type = 'text', required, readOnly, placeholder
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="field-label">
        {label}
        {required && <span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        readOnly={readOnly || !onChange}
        placeholder={placeholder}
        className="field-input"
      />
    </div>
  );
}
