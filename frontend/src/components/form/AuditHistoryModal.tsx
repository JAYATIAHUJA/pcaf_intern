import { useState, useEffect } from 'react';
import { IconX, IconHistory } from '@tabler/icons-react';
import { apiJson } from '../../lib/api';

interface AuditLog {
  id: number;
  userName: string;
  action: string;
  changes: string;
  createdAt: string;
}

export function AuditHistoryModal({ loanId, onClose }: { loanId: string; onClose: () => void }) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    apiJson<AuditLog[]>(`/audit-trail?loanId=${encodeURIComponent(loanId)}`)
      .then(data => {
        setLogs(data);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to load audit history.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loanId]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box modal-box-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconHistory size={18} style={{ color: '#64748b' }} />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Audit History - {loanId}</h3>
          </div>
          <button onClick={onClose} className="btn-icon"><IconX size={16} /></button>
        </div>
        <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {loading && (
            <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
              Loading history records...
            </div>
          )}
          
          {!loading && error && (
            <div style={{ padding: '16px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: 13 }}>
              {error}
            </div>
          )}

          {!loading && !error && logs.length === 0 && (
            <div style={{ padding: '24px 0', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              No audit logs found for this configuration yet.
            </div>
          )}

          {!loading && !error && logs.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {logs.map((entry) => {
                const actionBadgeClass = 
                  entry.action === 'Submitted' ? 'badge-info' : 
                  entry.action === 'Created' || entry.action === 'Created draft' ? 'badge-success' : 
                  entry.action === 'Approved' ? 'badge-primary' :
                  entry.action === 'Rejected' ? 'badge-danger' : 'badge-neutral';
                
                const formattedDate = new Date(entry.createdAt).toLocaleString(undefined, {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                });

                return (
                  <div key={entry.id} style={{ display: 'flex', gap: 16, padding: 16, borderRadius: 8, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <div className="dot-sm" style={{ 
                      background: entry.action === 'Approved' ? '#10b981' : 
                                  entry.action === 'Rejected' ? '#ef4444' : '#38bdf8', 
                      marginTop: 4 
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                        <span className={`badge ${actionBadgeClass}`} style={{ fontSize: 11 }}>{entry.action}</span>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>{formattedDate}</span>
                      </div>
                      <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.5, margin: 0 }}>{entry.changes}</p>
                      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, marginBottom: 0 }}>by <strong>{entry.userName}</strong></p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <div />
          <button onClick={onClose} className="btn btn-secondary btn-sm">Close</button>
        </div>
      </div>
    </div>
  );
}
