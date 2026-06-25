import toast from 'react-hot-toast';
import { useState } from 'react';
import { IconPlus, IconUpload, IconPencil, IconUserOff, IconUserCheck, IconSearch } from '@tabler/icons-react';
import { StatusBadge } from '../../components/FormComponents';

const USERS = [
  { id: 1, name: 'Arjun Kapoor', initials: 'AK', email: 'a.kapoor@meridian.com', role: 'Super Admin', roleClass: 'badge-purple', status: 'Active', lastLogin: '2 hours ago', dept: 'IT' },
  { id: 2, name: 'Priya Sharma', initials: 'PS', email: 'p.sharma@meridian.com', role: 'Risk Officer', roleClass: 'bg-violet-50 text-violet-700 badge', status: 'Active', lastLogin: '1 day ago', dept: 'Risk' },
  { id: 3, name: 'Rohit Mehta', initials: 'RM', email: 'r.mehta@meridian.com', role: 'Data Analyst', roleClass: 'badge-info', status: 'Active', lastLogin: '3 hours ago', dept: 'Sustainability' },
  { id: 4, name: 'Neha Singh', initials: 'NS', email: 'n.singh@meridian.com', role: 'Data Analyst', roleClass: 'badge-info', status: 'Active', lastLogin: '5 days ago', dept: 'Finance' },
  { id: 5, name: 'Amit Patel', initials: 'AP', email: 'a.patel@meridian.com', role: 'Viewer', roleClass: 'badge-neutral', status: 'Inactive', lastLogin: '21 days ago', dept: 'Compliance' },
  { id: 6, name: 'Sunita Rao', initials: 'SR', email: 's.rao@meridian.com', role: 'Auditor', roleClass: 'badge-warning', status: 'Active', lastLogin: 'Today', dept: 'Audit' },
  { id: 7, name: 'Kiran Das', initials: 'KD', email: 'k.das@meridian.com', role: 'Viewer', roleClass: 'badge-neutral', status: 'Pending', lastLogin: 'Never', dept: 'Treasury' },
];

const AVATAR_COLORS = ['bg-violet-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-400', 'bg-teal-500', 'bg-indigo-500'];

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const filtered = USERS.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const kpis = [
    { label: 'Total Users', value: USERS.length, color: 'text-slate-800' },
    { label: 'Active', value: USERS.filter(u => u.status === 'Active').length, color: 'text-emerald-600' },
    { label: 'Pending Invite', value: USERS.filter(u => u.status === 'Pending').length, color: 'text-amber-600' },
    { label: 'Inactive', value: USERS.filter(u => u.status === 'Inactive').length, color: 'text-slate-400' },
  ];

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>User Management</h2>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>Manage platform access, roles and account status</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><IconUpload size={14} /> Import Users</button>
          <button onClick={() => toast.success('Invitation sent successfully')} className="btn btn-primary btn-sm"><IconPlus size={14} /> Invite User</button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} className="kpi-card">
            <div className="text-xs text-slate-500 font-medium">{k.label}</div>
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <span style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>All Users</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select className="field-select" style={{ padding: "6px 32px 6px 12px", fontSize: 12, width: 144 }}>
              <option>All Roles</option>
              <option>Super Admin</option><option>Risk Officer</option><option>Data Analyst</option><option>Viewer</option><option>Auditor</option>
            </select>
            <select className="field-select" style={{ padding: "6px 32px 6px 12px", fontSize: 12, width: 128 }}>
              <option>All Status</option>
              <option>Active</option><option>Inactive</option><option>Pending</option>
            </select>
            <div style={{ position: "relative" }}>
              <IconSearch size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} className="field-input !py-1.5 !text-xs pl-7 w-44" />
            </div>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                {['User', 'Email', 'Department', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-xs">{u.initials}</span>
                      </div>
                      <span style={{ fontWeight: 500, color: "#1e293b", fontSize: 14 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: "#64748b" }}>{u.email}</td>
                  <td style={{ fontSize: 12, color: "#475569" }}>{u.dept}</td>
                  <td><span className={u.roleClass}>{u.role}</span></td>
                  <td><StatusBadge status={u.status} /></td>
                  <td style={{ fontSize: 12, color: "#94a3b8" }}>{u.lastLogin}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="btn-icon" style={{ width: 28, height: 28, color: "#0284c7" }}><IconPencil size={13} /></button>
                      {u.status === 'Active'
                        ? <button className="btn-icon" style={{ width: 28, height: 28, color: "#fb7185" }} title="Deactivate"><IconUserOff size={13} /></button>
                        : <button className="btn-icon" style={{ width: 28, height: 28, color: "#10b981" }} title="Activate"><IconUserCheck size={13} /></button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
