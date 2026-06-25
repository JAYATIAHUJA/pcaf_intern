import { useState } from 'react';
import toast from 'react-hot-toast';
import { IconPencil, IconHistory, IconCheck, IconX, IconCar, IconChartBar, IconCalendar } from '@tabler/icons-react';
import { MOCK_MV_CAPTURE, MOCK_MV_CONFIG, type MotorVehicleCapture, type DQOption } from '../../../constants/mockData';
import { Input, MonthPicker, DQRadioGroup, StatusBadge, AuditHistoryModal, Modal, FormRow, FormSection } from '../../../components/FormComponents';

const DQ_OPTIONS = [{ value: '1a', label: 'Option 1a' }, { value: '1b', label: 'Option 1b' }, { value: '2a', label: 'Option 2a' }, { value: '2b', label: 'Option 2b' }, { value: '3a', label: 'Option 3a' }];
const DQ_DESC: Record<string, string> = { '1a': 'Score 1a – Actual Fuel Consumption Based', '1b': 'Score 1b – Actual Distance Covered Based', '2a': 'Score 2a – Fuel Efficiency Factor Based', '2b': 'Score 2b – Vehicle Type Factor', '3a': 'Score 3a – Default Factor' };
type TabKey = 'Pending' | 'Draft' | 'Rejected' | 'Approved';

export default function MotorVehicleCapturePage() {
  const [tab, setTab] = useState<TabKey>('Pending');
  const [records, setRecords] = useState<MotorVehicleCapture[]>(MOCK_MV_CAPTURE);
  const [modalOpen, setModalOpen] = useState(false);
  const [auditLoanId, setAuditLoanId] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<MotorVehicleCapture | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [form, setForm] = useState({
    loanId: '', borrowerName: '', borrowerType: 'Individual', vehicleType: '', fuelType: '',
    vehicleMakeModel: '', vehicleNumber: '', sector: '', yearOfManufacture: '', originalValue: '',
    loanAmount: '', loanStartDate: '', loanEndDate: '',
    activityPeriod: '', outstandingAmount: '', dataQuality: '' as DQOption | '',
    actualFuelConsumption: '', fuelEmissionFactor: '', actualDistance: '', emissionFactor: '',
  });
  const setF = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const totalEmissions = records.reduce((s, r) => s + r.financedEmissions, 0);
  const counts: Record<TabKey, number> = {
    Pending: records.filter(r => r.status === 'Pending for Capture' || r.status === 'Submitted & Pending').length,
    Draft: records.filter(r => r.status === 'Pending for Capture').length,
    Rejected: 0,
    Approved: records.filter(r => r.status === 'Approved').length,
  };
  const shown = records.filter(r => {
    const matchTab = tab === 'Approved' ? r.status === 'Approved' : tab === 'Draft' ? r.status === 'Pending for Capture' : tab === 'Rejected' ? false : (r.status === 'Pending for Capture' || r.status === 'Submitted & Pending');
    const matchSearch = !search || r.loanId.toLowerCase().includes(search.toLowerCase());
    const matchDate = tab === 'Approved' ? (!dateFrom || r.activityPeriod >= dateFrom) && (!dateTo || r.activityPeriod <= dateTo) : true;
    return matchTab && matchSearch && matchDate;
  });

  function openEdit(rec: MotorVehicleCapture) {
    setEditRecord(rec);
    const cfg = MOCK_MV_CONFIG.find(c => c.loanId === rec.loanId);
    setForm({ loanId: rec.loanId, borrowerName: cfg?.borrowerName ?? '', borrowerType: cfg?.borrowerType ?? 'Individual', vehicleType: rec.vehicleType, fuelType: cfg?.fuelType ?? 'Petrol', vehicleMakeModel: rec.vehicleMakeModel, vehicleNumber: cfg?.vehicleNumber ?? '', sector: rec.vehicleType === 'Light Commercial' ? 'Transportation' : '', yearOfManufacture: String(rec.yearOfManufacture), originalValue: String(cfg?.vehicleValue ?? 16923), loanAmount: String(cfg?.loanAmount ?? 14231), loanStartDate: cfg?.loanStartDate ?? '', loanEndDate: cfg?.loanEndDate ?? '', activityPeriod: rec.activityPeriod, outstandingAmount: String(rec.outstandingAmount), dataQuality: rec.dataQuality ?? '', actualFuelConsumption: '1850', fuelEmissionFactor: '1.35', actualDistance: '', emissionFactor: '' });
    setModalOpen(true);
  }

  function handleSaveDraft() {
    if (editRecord) setRecords(prev => prev.map(r => r.id === editRecord.id ? { ...r, outstandingAmount: Number(form.outstandingAmount), dataQuality: form.dataQuality as DQOption, financedEmissions: Number(form.outstandingAmount) * 0.00005, status: 'Pending for Capture' } : r));
    setModalOpen(false);
    toast('Record saved as draft', { icon: '📝' });
  }

  function handleSubmit() {
    if (!form.dataQuality) { toast.error('Please select a Data Quality score'); return; }
    if (editRecord) setRecords(prev => prev.map(r => r.id === editRecord.id ? { ...r, outstandingAmount: Number(form.outstandingAmount), dataQuality: form.dataQuality as DQOption, financedEmissions: Number(form.outstandingAmount) * 0.00005, status: 'Submitted & Pending' } : r));
    setModalOpen(false);
    toast.success(`Record ${form.loanId} submitted successfully`);
  }

  function handleApprove() {
    const count = selected.length;
    setRecords(prev => prev.map(r => selected.includes(r.id) ? { ...r, status: 'Approved' } : r));
    setSelected([]);
    toast.success(`${count} record${count > 1 ? 's' : ''} approved`);
  }

  function handleReject() {
    if (!selected.length) { toast.error('Select at least one record to reject'); return; }
    toast.error(`${selected.length} record${selected.length > 1 ? 's' : ''} rejected`);
    setSelected([]);
  }

  const allSelected = shown.length > 0 && shown.every(r => selected.includes(r.id));

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%" }}>
      <div style={{ marginBottom: 20 }}><h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>Motor Vehicle Loans</h2><p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>PCAF Data Capture — Attribution: Outstanding Balance ÷ Original Value</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div className="kpi-card"><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div className="icon-box icon-box-md icon-box-emerald"><IconCar size={20} className="text-emerald-600" /></div><div><div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Total Emission</div><div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>{totalEmissions.toFixed(1)} <span style={{ fontSize: 14, fontWeight: 400, color: "#64748b" }}>tCO₂e</span></div></div></div></div>
        <div className="kpi-card"><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div className="icon-box icon-box-md icon-box-sky"><IconChartBar size={20} className="text-sky-600" /></div><div><div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Loan Emission Progress</div><div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>70 <span style={{ fontSize: 14, fontWeight: 400, color: "#64748b" }}>%</span></div></div></div><div className="progress-track"><div className="progress-bar" style={{ width: '70%' }} /></div></div>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: 16, borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex" }}>{(['Pending', 'Draft', 'Rejected', 'Approved'] as TabKey[]).map(t => (<button key={t} onClick={() => { setTab(t); setSelected([]); }} className={tab === t ? 'tab-btn-active' : 'tab-btn'}>{t} <span style={{ marginLeft: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 16, padding: "0 4px", fontSize: 10, fontWeight: 700, borderRadius: "999px", background: "#f1f5f9", color: "#475569" }}>{counts[t]}</span></button>))}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
            {tab === 'Approved' && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px" }}>
                <IconCalendar size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ fontSize: 12, color: "#475569", background: "transparent", border: "none", outline: "none", width: 112 }} />
                <span style={{ color: "#cbd5e1", fontSize: 12 }}>–</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ fontSize: 12, color: "#475569", background: "transparent", border: "none", outline: "none", width: 112 }} />
                {(dateFrom || dateTo) && <button onClick={() => { setDateFrom(''); setDateTo(''); }} style={{ color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}><IconX size={12} /></button>}
              </div>
            )}
            {tab === 'Pending' && (<><button onClick={handleApprove} disabled={!selected.length} className={`btn btn-success btn-sm${!selected.length ? ' opacity-40 cursor-not-allowed' : ''}`}><IconCheck size={14} /> Approve</button><button onClick={handleReject} className="btn btn-danger btn-sm"><IconX size={14} /> Reject</button><div className="divider-v" /></>)}
            <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} className="field-input" style={{ padding: "6px 12px", fontSize: 12, width: 160 }} />
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr><th className="w-10"><input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : shown.map(r => r.id))} className="checkbox-accent" /></th>{['Activity Period', 'Loan ID', 'Borrower Type', 'Vehicle Type', 'Make & Model', 'Year', 'Outstanding', 'DQ', 'Financed E.', 'Status', 'Actions'].map(h => <th key={h} className={h === 'Actions' ? 'text-center' : ''}>{h}</th>)}</tr></thead>
            <tbody>
              {shown.map(r => (<tr key={r.id}><td><input type="checkbox" checked={selected.includes(r.id)} onChange={e => setSelected(prev => e.target.checked ? [...prev, r.id] : prev.filter(i => i !== r.id))} className="checkbox-accent" /></td><td style={{ fontSize: 12, color: "#64748b" }}>{r.activityPeriod}</td><td><span style={{ fontWeight: 500, color: "#1e293b" }}>{r.loanId}</span></td><td style={{ fontSize: 12 }}>{r.borrowerType}</td><td style={{ fontSize: 12 }}>{r.vehicleType}</td><td style={{ fontSize: 12 }}>{r.vehicleMakeModel}</td><td style={{ fontSize: 12 }}>{r.yearOfManufacture}</td><td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.outstandingAmount.toLocaleString()}</td><td>{r.dataQuality ? <span className="badge badge-info">{r.dataQuality}</span> : <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>}</td><td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{r.financedEmissions.toFixed(2)}</td><td><StatusBadge status={r.status} /></td><td><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}><button onClick={() => openEdit(r)} className="btn-icon" style={{ width: 28, height: 28 }}><IconPencil size={13} /></button><button onClick={() => setAuditLoanId(r.loanId)} className="btn-icon" style={{ width: 28, height: 28 }}><IconHistory size={13} /></button></div></td></tr>))}
              {shown.length === 0 && <tr><td colSpan={12} style={{ textAlign: "center", padding: "40px 12px", color: "#94a3b8", fontSize: 14 }}>No records found</td></tr>}
            </tbody>
            <tfoot><tr><td colSpan={9} style={{ textAlign: "right", fontSize: 12, fontWeight: 600, color: "#64748b", padding: "10px 12px", background: "#f8fafc", borderTop: "2px solid #e2e8f0" }}>Sum:</td><td className="font-mono font-bold px-3 py-2.5 bg-slate-50 border-t-2 border-slate-200">{shown.reduce((s, r) => s + r.financedEmissions, 0).toFixed(1)}</td><td colSpan={2} style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0" }} /></tr></tfoot>
          </table>
        </div>
      </div>
      {modalOpen && (<Modal title={`Activity Detail — ${form.loanId}`} onClose={() => setModalOpen(false)} size="xl" footer={<><button onClick={handleSaveDraft} className="btn btn-secondary">Save as Draft</button><div className="flex gap-2"><button onClick={() => setModalOpen(false)} className="btn btn-cyan">Cancel</button><button onClick={handleSubmit} className="btn" style={{ background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Submit</button></div></>}>
        <FormSection title="Loan & Vehicle Information" />
        <FormRow cols={3}><Input label="Loan ID" value={form.loanId} readOnly required /><Input label="Borrower Name" value={form.borrowerName} readOnly required /><Input label="Borrower Type" value={form.borrowerType} readOnly required /></FormRow>
        <FormRow cols={4}><Input label="Vehicle Type" value={form.vehicleType} readOnly required /><Input label="Fuel Type" value={form.fuelType} readOnly required /><Input label="Vehicle Make & Model" value={form.vehicleMakeModel} readOnly required /><Input label="Vehicle Number" value={form.vehicleNumber} readOnly required /></FormRow>
        <FormRow cols={3}><Input label="Sector" value={form.sector} onChange={setF('sector')} required /><Input label="Year of Manufacture" value={form.yearOfManufacture} readOnly required /><Input label="Original Value (USD)" value={form.originalValue} readOnly required /></FormRow>
        <FormSection title="Loan Terms" />
        <FormRow cols={3}><Input label="Loan Amount (USD)" value={form.loanAmount} readOnly required /><Input label="Loan Start Date" value={form.loanStartDate} type="date" readOnly required /><Input label="Loan End Date" value={form.loanEndDate} type="date" readOnly required /></FormRow>
        <FormSection title="Activity & Emissions" />
        <FormRow cols={2}><MonthPicker label="Activity Period" value={form.activityPeriod} onChange={setF('activityPeriod')} required /><Input label="Outstanding Amount (USD)" value={form.outstandingAmount} onChange={setF('outstandingAmount')} required /></FormRow>
        <FormSection title="Data Quality Score" />
        <div className="mb-3"><label className="field-label mb-2">Select Data Quality Option<span className="text-rose-500 ml-0.5">*</span></label><DQRadioGroup value={form.dataQuality} onChange={setF('dataQuality')} options={DQ_OPTIONS} />{form.dataQuality && <div className="mt-2 px-3 py-2 bg-sky-50 rounded-lg text-xs text-sky-700 font-medium">{DQ_DESC[form.dataQuality]}</div>}</div>
        {form.dataQuality === '1a' && <FormRow cols={2}><Input label="Actual Vehicle Fuel Consumption" value={form.actualFuelConsumption} onChange={setF('actualFuelConsumption')} required /><Input label="Fuel Emission Factor" value={form.fuelEmissionFactor} onChange={setF('fuelEmissionFactor')} required /></FormRow>}
        {form.dataQuality === '1b' && <FormRow cols={2}><Input label="Actual Distance Covered (km)" value={form.actualDistance} onChange={setF('actualDistance')} required /><Input label="Emission Factor (tCO₂e/km)" value={form.emissionFactor} onChange={setF('emissionFactor')} required /></FormRow>}
      </Modal>)}
      {auditLoanId && <AuditHistoryModal loanId={auditLoanId} onClose={() => setAuditLoanId(null)} />}
    </div>
  );
}
