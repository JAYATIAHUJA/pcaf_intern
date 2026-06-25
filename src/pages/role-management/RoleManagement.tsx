import toast from 'react-hot-toast';
import { useState } from 'react';
import { IconPlus, IconRefresh, IconDeviceFloppy } from '@tabler/icons-react';

const ROLES = [
  { id: 1, name: 'Super Admin',  users: 2,  color: '#7c3aed', desc: 'Full platform access including system configuration' },
  { id: 2, name: 'Risk Officer', users: 4,  color: '#6366f1', desc: 'Can approve / reject data capture records' },
  { id: 3, name: 'Data Analyst', users: 12, color: '#0ea5e9', desc: 'Can create, edit, and submit emission records' },
  { id: 4, name: 'Viewer',       users: 8,  color: '#94a3b8', desc: 'Read-only access to dashboards and reports' },
  { id: 5, name: 'Auditor',      users: 3,  color: '#f59e0b', desc: 'Access to audit trail and data quality reports' },
];

const MODULES = ['Dashboard', 'Data Capture', 'Loan Configuration', 'User Management', 'Role Management', 'Settings', 'Reports', 'Audit Trail'];
const ALL_PERMS = ['view', 'create', 'edit', 'delete', 'approve', 'export'];

const PERMISSIONS: Record<string, Record<string, string[]>> = {
  'Super Admin':  { Dashboard: ['view'], 'Data Capture': ['view','create','edit','delete','approve'], 'Loan Configuration': ['view','create','edit','delete'], 'User Management': ['view','create','edit','delete'], 'Role Management': ['view','create','edit','delete'], Settings: ['view','edit'], Reports: ['view','export'], 'Audit Trail': ['view'] },
  'Risk Officer': { Dashboard: ['view'], 'Data Capture': ['view','approve'], 'Loan Configuration': ['view'], 'User Management': [], 'Role Management': [], Settings: ['view'], Reports: ['view','export'], 'Audit Trail': ['view'] },
  'Data Analyst': { Dashboard: ['view'], 'Data Capture': ['view','create','edit'], 'Loan Configuration': ['view'], 'User Management': [], 'Role Management': [], Settings: [], Reports: ['view'], 'Audit Trail': [] },
  Viewer:         { Dashboard: ['view'], 'Data Capture': ['view'], 'Loan Configuration': ['view'], 'User Management': [], 'Role Management': [], Settings: [], Reports: ['view'], 'Audit Trail': [] },
  Auditor:        { Dashboard: ['view'], 'Data Capture': ['view'], 'Loan Configuration': ['view'], 'User Management': [], 'Role Management': [], Settings: [], Reports: ['view','export'], 'Audit Trail': ['view'] },
};

const PERM_COLORS: Record<string, string> = {
  view: 'badge-info', create: 'badge-success', edit: 'badge-warning',
  delete: 'bg-rose-50 text-rose-600 badge', approve: 'badge-purple', export: 'badge-neutral',
};

export default function RoleManagement() {
  const [activeRole, setActiveRole] = useState('Data Analyst');

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>Role Management</h2>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>Define permission sets and assign them to users</p>
        </div>
        <button className="btn btn-primary btn-sm"><IconPlus size={14} /> Create Role</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>
        {/* Role list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ROLES.map(role => {
            const isActive = activeRole === role.name;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.name)}
                style={{
                  textAlign: 'left',
                  width: '100%',
                  borderRadius: 12,
                  padding: '14px 16px',
                  border: isActive ? '1px solid #334155' : '1px solid #e2e8f0',
                  background: isActive ? '#0f172a' : '#ffffff',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 2px rgba(0,0,0,0.05)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: role.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: isActive ? '#f1f5f9' : '#1e293b' }}>{role.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{role.users} users</span>
                </div>
                <p style={{ fontSize: 12, color: isActive ? '#64748b' : '#94a3b8', lineHeight: 1.5, margin: 0 }}>{role.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Permission matrix */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>Permissions for: <span style={{ color: '#0284c7' }}>{activeRole}</span></h3>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Check/uncheck to modify access. Changes are not saved until you click Save.</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary btn-sm"><IconRefresh size={13} /> Reset</button>
              <button onClick={() => toast.success('Permissions saved')} className="btn btn-primary btn-sm"><IconDeviceFloppy size={13} /> Save Changes</button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 150 }}>Module</th>
                  {ALL_PERMS.map(p => (
                    <th key={p} style={{ textAlign: 'center', textTransform: 'capitalize' }}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODULES.map(mod => {
                  const perms = PERMISSIONS[activeRole]?.[mod] ?? [];
                  return (
                    <tr key={mod}>
                      <td style={{ fontWeight: 500, color: '#334155' }}>{mod}</td>
                      {ALL_PERMS.map(p => (
                        <td key={p} style={{ textAlign: 'center' }}>
                          <input type="checkbox" defaultChecked={perms.includes(p)} className="checkbox-accent" />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Permission legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '12px 20px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginRight: 4 }}>Permission types:</span>
            {ALL_PERMS.map(p => (
              <span key={p} className={`badge ${PERM_COLORS[p]}`} style={{ fontSize: 11 }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
