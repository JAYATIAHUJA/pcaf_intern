import React from 'react';

export function FormSection({ title }: { title?: string }) {
  return title
    ? <div className="form-section">{title}</div>
    : <div className="form-section-spacer" />;
}
