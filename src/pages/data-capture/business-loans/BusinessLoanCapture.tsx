import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  IconPencil, IconHistory, IconCheck, IconX,
  IconBriefcase, IconChartBar, IconCalendar,
} from '@tabler/icons-react';
import { MOCK_BL_CAPTURE, type BusinessLoanCapture, type DQOption } from '../../../constants/mockData';
import { Input, Select, MonthPicker, DQRadioGroup, StatusBadge, AuditHistoryModal, Modal, FormRow, FormSection } from '../../../components/FormComponents';

const SECTORS = ['Agriculture, Forestry & Fishing', 'Manufacturing', 'Energy & Power', 'Transportation & Storage', 'Wholesale & Retail Trade', 'Construction & Real Estate', 'Tourism & Hospitality'];
const DQ_OPTIONS = [{ value: '1a', label: 'Option 1a' }, { value: '1b', label: 'Option 1b' }, { value: '2a', label: 'Option 2a' }, { value: '2b', label: 'Option 2b' }, { value: '3a', label: 'Option 3a' }];
const DQ_DESC: Record<string, string> = { '1a': 'Score 1a – Verified company emissions', '1b': 'Score 1b – Reported company emissions', '2a': 'Score 2a – Estimated using revenue', '2b': 'Score 2b – Estimated using EBIT', '3a': 'Score 3a – Physical activity default' };

type TabKey = 'Pending' | 'Draft' | 'Rejected' | 'Approved';

interface FormState {
  loanId: string; typeOfCompany: string; sector: string;
  borrowerName: string; borrowerType: string; borrowerRegNo: string;
  city: string; country: string;
  loanAmount: string; loanTenure: string; loanStartDate: string; loanEndDate: string;
  totalEquity: string; totalDebt: string;
  activityPeriod: string; outstandingAmount: string;
  dataQuality: DQOption | '';
}

const BLANK: FormState = {
  loanId: '', typeOfCompany: 'Private', sector: SECTORS[0],
  borrowerName: '', borrowerType: 'Large Corporate', borrowerRegNo: '',
  city: '', country: 'Kenya', loanAmount: '', loanTenure: '',
  loanStartDate: '', loanEndDate: '', totalEquity: '', totalDebt: '',
  activityPeriod: '', outstandingAmount: '', dataQuality: '',
};

export default function BusinessLoanCapturePage() {
  const [tab, setTab] = useState<TabKey>('Pending');
  const [records, setRecords] = useState<BusinessLoanCapture[]>(MOCK_BL_CAPTURE);
  const [modalOpen, setModalOpen] = useState(false);
  const [auditLoanId, setAuditLoanId] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<BusinessLoanCapture | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [form, setForm] = useState<FormState>(BLANK);

  const setF = (k: keyof FormState) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const totalEmissions = records.reduce((s, r) => s + r.financedEmissions, 0);

  const counts: Record<TabKey, number> = {
    Pending: records.filter(r => r.status === 'Pending for Capture' || r.status === 'Submitted & Pending').length,
    Draft: records.filter(r => r.status === 'Pending for Capture').length,
    Rejected: 0,
    Approved: records.filter(r => r.status === 'Approved').length,
  };

  const shown = records.filter(r => {
    const matchTab =
      tab === 'Approved' ? r.status === 'Approved' :
      tab === 'Draft'    ? r.status === 'Pending for Capture' :
      tab === 'Rejected' ? false :
                           (r.status === 'Pending for Capture' || r.status === 'Submitted & Pending');
    const matchSearch = !search || r.loanId.toLowerCase().includes(search.toLowerCase()) || r.borrowerName.toLowerCase().includes(search.toLowerCase());
    const matchDate = tab === 'Approved'
      ? (!dateFrom || r.activityPeriod >= dateFrom) && (!dateTo || r.activityPeriod <= dateTo)
      : true;
    return matchTab && matchSearch && matchDate;
  });

  function openEdit(rec: BusinessLoanCapture) {
    setEditRecord(rec);
    setForm({
      loanId: rec.loanId, typeOfCompany: rec.typeOfCompany, sector: rec.sector,
      borrowerName: rec.borrowerName, borrowerType: 'Large Corporate', borrowerRegNo: 'PVT-KE-987654',
      city: rec.city, country: rec.country,
      loanAmount: String(rec.loanAmount), loanTenure: '72', loanStartDate: '', loanEndDate: '',
      totalEquity: String(rec.totalEquity), totalDebt: String(rec.totalDebt),
      activityPeriod: rec.activityPeriod, outstandingAmount: String(rec.outstandingAmount),
      dataQuality: rec.dataQuality ?? '',
    });
    setModalOpen(true);
  }

  function handleSaveDraft() {
    if (editRecord) {
      setRecords(prev => prev.map(r => r.id === editRecord.id ? {
        ...r, outstandingAmount: Number(form.outstandingAmount), dataQuality: form.dataQuality as DQOption,
        financedEmissions: Number(form.outstandingAmount) * 0.003, status: 'Pending for Capture',
      } : r));
    }
    setModalOpen(false);
    toast('Record saved as draft', { icon: '📝' });
  }

  function handleSubmit() {
    if (!form.dataQuality) { toast.error('Please select a Data Quality score'); return; }
    if (editRecord) {
      setRecords(prev => prev.map(r => r.id === editRecord.id ? {
        ...r, outstandingAmount: Number(form.outstandingAmount), dataQuality: form.dataQuality as DQOption,
        financedEmissions: Number(form.outstandingAmount) * 0.003, status: 'Submitted & Pending',
      } : r));
    }
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
  const toggleAll = () => setSelected(allSelected ? [] : shown.map(r => r.id));

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>Business Loan</h2>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>PCAF Data Capture — Attribution: Outstanding ÷ EVIC</p>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div className="kpi-card">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="icon-box icon-box-md icon-box-emerald">
              <IconBriefcase size={20} className="text-emerald-600" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Total Emission</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>{totalEmissions.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 400, color: "#64748b" }}>tCO₂e</span></div>
            </div>
          </div>
        </div>
        <div className="kpi-card">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="icon-box icon-box-md icon-box-sky">
              <IconChartBar size={20} className="text-sky-600" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Loan Emission Progress</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>68 <span style={{ fontSize: 14, fontWeight: 400, color: "#64748b" }}>%</span></div>
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-bar" style={{ width: '68%' }} />
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: 16, borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex" }}>
            {(['Pending', 'Draft', 'Rejected', 'Approved'] as TabKey[]).map(t => (
              <button key={t} onClick={() => { setTab(t); setSelected([]); }} className={tab === t ? 'tab-btn-active' : 'tab-btn'}>
                {t}
                <span style={{ marginLeft: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 16, padding: "0 4px", fontSize: 10, fontWeight: 700, borderRadius: "999px", background: "#f1f5f9", color: "#475569" }}>
                  {counts[t]}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
            {/* Date range — only on Approved tab */}
            {tab === 'Approved' && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px" }}>
                <IconCalendar size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ fontSize: 12, color: "#475569", background: "transparent", border: "none", outline: "none", width: 112 }} title="From date" />
                <span style={{ color: "#cbd5e1", fontSize: 12 }}>–</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ fontSize: 12, color: "#475569", background: "transparent", border: "none", outline: "none", width: 112 }} title="To date" />
                {(dateFrom || dateTo) && (
                  <button onClick={() => { setDateFrom(''); setDateTo(''); }} style={{ color: "#94a3b8", background: "none", border: "none", cursor: "pointer", marginLeft: 2 }}><IconX size={12} /></button>
                )}
              </div>
            )}

            {/* Approve + Reject — only on Pending tab */}
            {tab === 'Pending' && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={!selected.length}
                  className={`btn btn-success btn-sm${!selected.length ? ' opacity-40 cursor-not-allowed' : ''}`}
                >
                  <IconCheck size={14} /> Approve
                </button>
                <button onClick={handleReject} className="btn btn-danger btn-sm">
                  <IconX size={14} /> Reject
                </button>
                <div className="divider-v" />
              </>
            )}

            <input
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="field-input" style={{ padding: "6px 12px", fontSize: 12, width: 160 }}
            />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-10 text-center">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="checkbox-accent" />
                </th>
                {['Activity Period', 'Loan ID', 'Borrower Name', 'Type', 'Sector', 'City', 'Loan Amount', 'Total Equity', 'Total Debt', 'DQ', 'Financed E.', 'Status', 'Actions'].map(h => (
                  <th key={h} className={h === 'Actions' ? 'text-center' : ''}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map(r => (
                <tr key={r.id}>
                  <td className="text-center">
                    <input type="checkbox" checked={selected.includes(r.id)} onChange={e => setSelected(prev => e.target.checked ? [...prev, r.id] : prev.filter(i => i !== r.id))} className="checkbox-accent" />
                  </td>
                  <td style={{ fontSize: 12, color: "#64748b" }}>{r.activityPeriod}</td>
                  <td><span style={{ fontWeight: 500, color: "#1e293b" }}>{r.loanId}</span></td>
                  <td style={{ fontSize: 14 }}>{r.borrowerName}</td>
                  <td><span style={{ fontSize: 12, color: "#475569" }}>{r.typeOfCompany}</span></td>
                  <td><span style={{ fontSize: 12, color: "#64748b" }}>{r.sector.length > 22 ? r.sector.substring(0, 22) + '…' : r.sector}</span></td>
                  <td style={{ fontSize: 12, color: "#64748b" }}>{r.city}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.loanAmount.toLocaleString()}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.totalEquity.toLocaleString()}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.totalDebt.toLocaleString()}</td>
                  <td>{r.dataQuality ? <span className="badge badge-info">{r.dataQuality}</span> : <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "#334155" }}>{r.financedEmissions > 0 ? r.financedEmissions.toFixed(0) : '0'}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      <button onClick={() => openEdit(r)} className="btn-icon" style={{ width: 28, height: 28 }} title="Edit"><IconPencil size={13} /></button>
                      <button onClick={() => setAuditLoanId(r.loanId)} className="btn-icon" style={{ width: 28, height: 28 }} title="Audit history"><IconHistory size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr><td colSpan={14} style={{ textAlign: "center", padding: "40px 12px", color: "#94a3b8", fontSize: 14 }}>No records found</td></tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={11} style={{ textAlign: "right", fontSize: 12, fontWeight: 600, color: "#64748b", padding: "10px 12px", background: "#f8fafc", borderTop: "2px solid #e2e8f0" }}>
                  Sum of Financed Emissions:
                </td>
                <td style={{ fontFamily: "monospace", fontWeight: 700, color: "#334155", padding: "10px 12px", background: "#f8fafc", borderTop: "2px solid #e2e8f0" }}>
                  {shown.reduce((s, r) => s + r.financedEmissions, 0).toFixed(0)}
                </td>
                <td colSpan={2} style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0" }} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal
          title={`Activity Detail — ${form.loanId}`}
          onClose={() => setModalOpen(false)}
          size="xl"
          footer={
            <>
              <button onClick={handleSaveDraft} className="btn btn-secondary">Save as Draft</button>
              <div className="flex gap-2">
                <button onClick={() => setModalOpen(false)} className="btn btn-cyan">Cancel</button>
                <button onClick={handleSubmit} className="btn" style={{ background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Submit</button>
              </div>
            </>
          }
        >
          <FormSection title="Loan Information" />
          <FormRow cols={3}>
            <Input label="Loan ID" value={form.loanId} readOnly required />
            <Input label="Type of Company" value={form.typeOfCompany} readOnly required />
            <Select label="Sector" value={form.sector} onChange={setF('sector')} options={SECTORS} required />
          </FormRow>
          <FormRow cols={3}>
            <Input label="Borrower Name" value={form.borrowerName} onChange={setF('borrowerName')} required />
            <Input label="Borrower Type" value={form.borrowerType} readOnly required />
            <Input label="Borrower Registration No." value={form.borrowerRegNo} readOnly required />
          </FormRow>
          <FormRow cols={2}>
            <Input label="City" value={form.city} onChange={setF('city')} required />
            <Input label="Country" value={form.country} readOnly required />
          </FormRow>
          <FormSection title="Loan Terms" />
          <FormRow cols={4}>
            <Input label="Loan Amount (USD)" value={form.loanAmount} readOnly required />
            <Input label="Loan Tenure (Months)" value={form.loanTenure} readOnly required />
            <Input label="Loan Start Date" value={form.loanStartDate} onChange={setF('loanStartDate')} type="date" required />
            <Input label="Loan End Date" value={form.loanEndDate} onChange={setF('loanEndDate')} type="date" required />
          </FormRow>
          <FormRow cols={2}>
            <Input label="Total Equity (USD)" value={form.totalEquity} onChange={setF('totalEquity')} required />
            <Input label="Total Debt (USD)" value={form.totalDebt} onChange={setF('totalDebt')} required />
          </FormRow>
          <FormSection title="Activity Period & Emissions" />
          <FormRow cols={2}>
            <MonthPicker label="Activity Period" value={form.activityPeriod} onChange={setF('activityPeriod')} required />
            <Input label="Outstanding Amount (USD)" value={form.outstandingAmount} onChange={setF('outstandingAmount')} required />
          </FormRow>
          <FormSection title="Data Quality Score" />
          <div className="mb-2">
            <label className="field-label mb-2">Select Data Quality Option<span className="text-rose-500 ml-0.5">*</span></label>
            <DQRadioGroup value={form.dataQuality} onChange={setF('dataQuality')} options={DQ_OPTIONS} />
            {form.dataQuality && (
              <div className="mt-2 px-3 py-2 bg-sky-50 rounded-lg text-xs text-sky-700 font-medium">{DQ_DESC[form.dataQuality]}</div>
            )}
          </div>
        </Modal>
      )}

      {auditLoanId && <AuditHistoryModal loanId={auditLoanId} onClose={() => setAuditLoanId(null)} />}
    </div>
  );
}
