import { useState, useEffect } from 'react';
import { 
  IconHistory, IconSearch, IconFilter, IconArrowRight, IconDownload, IconAlertCircle 
} from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { apiJson } from '../../lib/api';

interface AuditLog {
  id: number;
  userId: number | null;
  userName: string;
  action: string;
  loanId: string | null;
  entityType: string;
  changes: string;
  createdAt: string;
}

export default function AuditTrail() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  function fetchLogs() {
    setLoading(true);
    setError('');
    apiJson<AuditLog[]>('/audit-trail')
      .then(data => {
        setLogs(data);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to load audit trail logs.');
        toast.error('Access Denied or Connection Error');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Filter logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.loanId && log.loanId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.changes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesEntity = entityFilter === 'All' || log.entityType === entityFilter;
    
    const matchesAction = actionFilter === 'All' || 
      (actionFilter === 'Writes' && ['Created', 'Created draft', 'Edited', 'Edited draft', 'Updated user', 'Activated user', 'Deactivated user', 'Deleted', 'Deleted user', 'Reset user password', 'Reset password', 'Changed password'].includes(log.action)) ||
      (actionFilter === 'Approvals' && ['Approved', 'Rejected'].includes(log.action)) ||
      (actionFilter === 'Auth' && ['User logged in', 'User logged out'].includes(log.action));

    return matchesSearch && matchesEntity && matchesAction;
  });

  // Pagination bounds
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredLogs.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);

  function handleExport() {
    if (filteredLogs.length === 0) {
      toast.error('No logs available to export');
      return;
    }
    
    // Simple CSV export simulation
    const headers = ['ID', 'User', 'Action', 'Entity', 'Loan ID', 'Description', 'Timestamp'];
    const rows = filteredLogs.map(log => [
      log.id,
      `"${log.userName}"`,
      `"${log.action}"`,
      `"${log.entityType}"`,
      log.loanId ? `"${log.loanId}"` : '""',
      `"${log.changes.replace(/"/g, '""')}"`,
      new Date(log.createdAt).toISOString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pcaf_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Audit trail logs exported successfully.');
  }

  function getActionBadge(action: string) {
    let cls = 'badge-neutral';
    if (['Created', 'Created draft'].includes(action)) cls = 'badge-success';
    else if (['Edited', 'Edited draft', 'Updated user', 'Updated settings'].includes(action)) cls = 'badge-warning';
    else if (['Deleted', 'Deleted user'].includes(action)) cls = 'badge-danger';
    else if (action === 'Approved') cls = 'badge-primary';
    else if (action === 'Rejected') cls = 'badge-danger';
    else if (['User logged in', 'User logged out'].includes(action)) cls = 'badge-info';
    
    return <span className={`badge ${cls}`} style={{ fontSize: 11 }}>{action}</span>;
  }

  if (error && (error.includes('Forbidden') || error.includes('403') || error.includes('permissions') || error.includes('Unauthorized'))) {
    return (
      <div style={{ padding: 24, background: '#f1f5f9', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32, maxWidth: 480, textAlign: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Access Denied</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            You do not have permission to view the central Audit Trail dashboard. Only Super Admins, Risk Officers, and Auditors have access to these audit logs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: '#f1f5f9', minHeight: '100%' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Audit Trail</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>
            Secure system logging of all user activities, data capture edits, approvals, and administrative actions
          </p>
        </div>
        <button className="btn btn-secondary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconDownload size={15} /> Export logs CSV
        </button>
      </div>

      {/* Filter Card */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 16, marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
          <IconSearch size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by user, description, loan ID..." 
            className="field-input" 
            style={{ paddingLeft: 36, width: '100%' }} 
          />
        </div>

        {/* Entity Filter */}
        <div style={{ minWidth: 160, display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconFilter size={15} style={{ color: '#64748b' }} />
          <select 
            value={entityFilter} 
            onChange={e => { setEntityFilter(e.target.value); setCurrentPage(1); }}
            className="field-input" 
            style={{ padding: '6px 12px', fontSize: 13 }}
          >
            <option value="All">All Entities</option>
            <option value="Data Capture">Data Capture</option>
            <option value="Loan Configuration">Loan Config</option>
            <option value="User">User Accounts</option>
            <option value="Settings">Settings</option>
            <option value="Auth">Security / Auth</option>
          </select>
        </div>

        {/* Action Group Filter */}
        <div style={{ minWidth: 160, display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconFilter size={15} style={{ color: '#64748b' }} />
          <select 
            value={actionFilter} 
            onChange={e => { setActionFilter(e.target.value); setCurrentPage(1); }}
            className="field-input" 
            style={{ padding: '6px 12px', fontSize: 13 }}
          >
            <option value="All">All Actions</option>
            <option value="Writes">Data Changes (Edits/Creates)</option>
            <option value="Approvals">Approvals & Rejections</option>
            <option value="Auth">Sessions (Logins/Logouts)</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {loading && (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#64748b' }}>
            Loading audit trail data...
          </div>
        )}

        {!loading && filteredLogs.length === 0 && (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <IconAlertCircle size={32} style={{ color: '#94a3b8' }} />
            <div>
              <div style={{ fontWeight: 600, color: '#1e293b' }}>No logs found</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Try adjusting your search query or filters.</div>
            </div>
          </div>
        )}

        {!loading && filteredLogs.length > 0 && (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#475569', width: 140 }}>User</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#475569', width: 120 }}>Action</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#475569', width: 130 }}>Entity</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#475569', width: 110 }}>Loan ID</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#475569' }}>Description of Activity</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#475569', width: 160 }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map(log => {
                    const formattedDate = new Date(log.createdAt).toLocaleString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit', second: '2-digit'
                    });

                    return (
                      <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                          {log.userName}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {getActionBadge(log.action)}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 12, color: '#475569', fontWeight: 500 }}>
                          {log.entityType}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 12, fontFamily: 'monospace', color: '#0369a1', fontWeight: 600 }}>
                          {log.loanId || '-'}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#334155', lineHeight: 1.45 }}>
                          {log.changes}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>
                          {formattedDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredLogs.length)} of {filteredLogs.length} logs
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="btn btn-secondary btn-sm"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="btn btn-secondary btn-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

