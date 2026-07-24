import type { UserRow } from '../../../types/admin';

interface StatsStripProps {
  users: UserRow[];
}

export function StatsStrip({ users }: StatsStripProps) {
  const kpis = [
    { label: 'Total Users', value: users.length, color: 'text-slate-800' },
    { label: 'Active', value: users.filter(user => user.status === 'Active').length, color: 'text-emerald-600' },
    { label: 'Pending Invite', value: users.filter(user => user.status === 'Pending').length, color: 'text-amber-600' },
    { label: 'Inactive', value: users.filter(user => user.status === 'Inactive').length, color: 'text-slate-400' },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
      {kpis.map(k => (
        <div key={k.label} className="kpi-card">
          <div className="text-xs text-slate-500 font-medium">{k.label}</div>
          <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
        </div>
      ))}
    </div>
  );
}
