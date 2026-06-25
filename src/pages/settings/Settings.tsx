import toast from 'react-hot-toast';
import { IconBuilding, IconSettings2, IconBell, IconPlug } from '@tabler/icons-react';
import { Input, Select, Textarea } from '../../components/FormComponents';

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="kpi-card">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
        <div className="icon-box icon-box-sm icon-box-sky">{icon}</div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked }: { checked: boolean }) {
  return (
    <div style={{ position: "relative", width: 40, height: 20, borderRadius: "999px", cursor: "pointer", background: checked ? "#0ea5e9" : "#e2e8f0" }}>
      <div style={{ position: "absolute", top: 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.15s", left: checked ? 20 : 2 }} />
    </div>
  );
}

export default function Settings() {
  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>Settings</h2>
        <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>Configure organisation profile and PCAF reporting parameters</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <SectionCard title="Organisation Profile" icon={<IconBuilding size={16} />}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Institution Name" value="Meridian Capital Bank" onChange={() => {}} />
            <Input label="LEI (Legal Entity Identifier)" value="2138004GERSZ2BBSWP69" onChange={() => {}} />
            <Select label="Headquarters Country" value="India" onChange={() => {}} options={['India', 'Kenya', 'Germany', 'United States', 'United Kingdom']} />
            <Input label="PCAF Signatory Since" value="2021" onChange={() => {}} />
            <button onClick={() => toast.success('Organisation profile saved')} className="btn btn-primary" style={{ alignSelf: "start" }}>Save Changes</button>
          </div>
        </SectionCard>

        <SectionCard title="Reporting Configuration" icon={<IconSettings2 size={16} />}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Select label="Fiscal Year" value="January – December (Calendar Year)" onChange={() => {}} options={['January – December (Calendar Year)', 'April – March']} />
            <Select label="Reporting Currency" value="USD – US Dollar" onChange={() => {}} options={['USD – US Dollar', 'INR – Indian Rupee', 'EUR – Euro', 'KES – Kenyan Shilling']} />
            <Select label="Default Emission Factor Source" value="IEA World Energy Statistics 2024" onChange={() => {}} options={['IEA World Energy Statistics 2024', 'GHG Protocol', 'IPCC AR6']} />
            <Select label="Consolidation Approach" value="Operational Control" onChange={() => {}} options={['Operational Control', 'Financial Control', 'Equity Share']} />
            <button onClick={() => toast.success('Reporting settings saved')} className="btn btn-primary" style={{ alignSelf: "start" }}>Save Changes</button>
          </div>
        </SectionCard>

        <SectionCard title="Notification Settings" icon={<IconBell size={16} />}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: 'Email digest on pending approvals', sub: 'Daily summary of records awaiting action', on: true },
              { label: 'Alert when data quality drops below DQ 3', sub: 'Immediate email on threshold breach', on: true },
              { label: 'Notify on emission factor updates', sub: 'When IEA / GHG Protocol releases new factors', on: false },
              { label: 'Monthly coverage summary email', sub: 'Portfolio-wide report first Monday of month', on: true },
            ].map(item => (
              <div key={item.label} className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-700">{item.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.sub}</div>
                </div>
                <Toggle checked={item.on} />
              </div>
            ))}
            <button onClick={() => toast.success('Notification settings saved')} className="btn btn-primary" style={{ alignSelf: "start", marginTop: 8 }}>Save</button>
          </div>
        </SectionCard>

        <SectionCard title="Integrations" icon={<IconPlug size={16} />}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { name: 'Bloomberg ESG Data', status: 'Connected', statusClass: 'badge-success' },
              { name: 'CDP Climate Disclosure', status: 'Not connected', statusClass: 'badge-neutral' },
              { name: 'Core Banking System (CBS)', status: 'Connected', statusClass: 'badge-success' },
              { name: 'SFTP Auto-import', status: 'Error', statusClass: 'bg-rose-50 text-rose-700 badge' },
            ].map(int => (
              <div key={int.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 8, border: "1px solid #f1f5f9", background: "#f8fafc" }}>
                <div>
                  <div className="text-sm font-medium text-slate-800">{int.name}</div>
                  <span className={int.statusClass} style={{ fontSize: 11, marginTop: 2 }}>{int.status}</span>
                </div>
                <button className="btn btn-secondary btn-sm">{int.status === 'Connected' ? 'Configure' : 'Connect'}</button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
