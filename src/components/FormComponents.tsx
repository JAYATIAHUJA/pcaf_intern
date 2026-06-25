import React from 'react';
import { IconX, IconHistory } from '@tabler/icons-react';

export function Input({ label, value, onChange, type = 'text', required, readOnly, placeholder }: { label: string; value: string; onChange?: (v: string) => void; type?: string; required?: boolean; readOnly?: boolean; placeholder?: string; }) {
  return (
    <div>
      <label className="field-label">{label}{required && <span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span>}</label>
      <input type={type} value={value} onChange={e => onChange?.(e.target.value)} readOnly={readOnly || !onChange} placeholder={placeholder} className="field-input" />
    </div>
  );
}

export function Select({ label, value, onChange, options, required }: { label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean; }) {
  return (
    <div>
      <label className="field-label">{label}{required && <span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span>}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="field-select">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function Textarea({ label, value, onChange, rows = 3, required }: { label: string; value: string; onChange: (v: string) => void; rows?: number; required?: boolean; }) {
  return (
    <div>
      <label className="field-label">{label}{required && <span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span>}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className="field-textarea" />
    </div>
  );
}

export function MonthPicker({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; }) {
  return (
    <div>
      <label className="field-label">{label}{required && <span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span>}</label>
      <input type="month" value={value} onChange={e => onChange(e.target.value)} className="field-input" />
    </div>
  );
}

export function DQRadioGroup({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {options.map(opt => (
        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14, color: '#334155' }}>
          <input type="radio" name="dq_option" value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} className="radio-accent" />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'Approved'            ? 'badge badge-success' :
    status === 'Submitted & Pending' ? 'badge badge-info' :
    status === 'Active'              ? 'badge badge-success' :
    status === 'Pending for Capture' ? 'badge badge-warning' :
    status === 'Rejected'            ? 'badge badge-danger' :
    'badge badge-neutral';
  return <span className={cls}>{status}</span>;
}

const MOCK_AUDIT = [
  { date: '2026-06-20 14:32', user: 'Arjun Kapoor', action: 'Submitted', changes: 'Outstanding Amount set to 1,154,000. DQ Score: 2a.' },
  { date: '2026-06-18 09:15', user: 'Priya Sharma', action: 'Edited', changes: 'Total Equity updated from 6,500,000 to 7,077,000.' },
  { date: '2026-06-10 11:00', user: 'Rohit Mehta', action: 'Created', changes: 'Record created with Loan ID BL-KE-005.' },
];

export function AuditHistoryModal({ loanId, onClose }: { loanId: string; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box modal-box-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconHistory size={18} style={{ color: '#64748b' }} />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Audit History — {loanId}</h3>
          </div>
          <button onClick={onClose} className="btn-icon"><IconX size={16} /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_AUDIT.map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: 16, borderRadius: 8, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <div className="dot-sm" style={{ background: '#38bdf8' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <span className={`badge ${entry.action === 'Submitted' ? 'badge-info' : entry.action === 'Created' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: 11 }}>{entry.action}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{entry.date}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#334155' }}>{entry.changes}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>by {entry.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <div />
          <button onClick={onClose} className="btn btn-secondary btn-sm">Close</button>
        </div>
      </div>
    </div>
  );
}

export function Modal({ title, onClose, children, footer, size = 'lg' }: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; }) {
  const sizeClass = { sm: 'modal-box-sm', md: 'modal-box-md', lg: 'modal-box-lg', xl: 'modal-box-xl' }[size];
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

export function FormRow({ cols = 3, children }: { cols?: number; children: React.ReactNode }) {
  return (
    <div className="form-row" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>{children}</div>
  );
}

export function FormSection({ title }: { title?: string }) {
  return title
    ? <div className="form-section">{title}</div>
    : <div className="form-section-spacer" />;
}
