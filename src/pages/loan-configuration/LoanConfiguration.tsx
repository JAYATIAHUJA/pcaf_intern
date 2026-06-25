import { useState } from 'react';
import toast from 'react-hot-toast';
import { IconPlus, IconUpload, IconPencil, IconTrash, IconSearch } from '@tabler/icons-react';
import { MOCK_BL_CONFIG, MOCK_CRE_CONFIG, MOCK_MV_CONFIG, MOCK_MORTGAGE_CONFIG, type BusinessLoanConfig, type LoanStatus } from '../../constants/mockData';
import { Input, Select, Textarea, StatusBadge, Modal, FormRow, FormSection } from '../../components/FormComponents';

type LoanTab = 'Business Loans' | 'Commercial Real Estate' | 'Motor Vehicle' | 'Mortgage';
const TABS: LoanTab[] = ['Business Loans', 'Commercial Real Estate', 'Motor Vehicle', 'Mortgage'];
const SECTORS = ['Agriculture, Forestry & Fishing', 'Manufacturing', 'Energy & Power', 'Transportation & Storage', 'Wholesale & Retail Trade', 'Construction & Real Estate', 'Tourism & Hospitality', 'Information Technology'];

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap", cursor: "pointer", userSelect: "none" }}>{children}</th>;
}

export default function LoanConfiguration() {
  const [tab, setTab] = useState<LoanTab>('Business Loans');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [blData, setBlData] = useState(MOCK_BL_CONFIG);

  const [blForm, setBlForm] = useState({
    loanId: '', typeOfCompany: 'Private', sector: SECTORS[0],
    borrowerName: '', borrowerType: 'Large Corporate', borrowerRegNo: '',
    city: '', country: 'Kenya', loanAmount: '', loanTenure: '',
    loanStartDate: '', loanEndDate: '', remarks: '',
  });
  const setF = (k: string) => (v: string) => setBlForm(p => ({ ...p, [k]: v }));

  function openEdit(id: string) {
    const rec = blData.find(r => r.loanId === id);
    if (!rec) return;
    setEditId(id);
    setBlForm({
      loanId: rec.loanId, typeOfCompany: rec.typeOfCompany, sector: rec.sector,
      borrowerName: rec.borrowerName, borrowerType: rec.borrowerType, borrowerRegNo: rec.borrowerRegNo,
      city: rec.city, country: rec.country,
      loanAmount: String(rec.loanAmount), loanTenure: String(rec.loanTenure),
      loanStartDate: rec.loanStartDate, loanEndDate: rec.loanEndDate, remarks: '',
    });
    setModalOpen(true);
  }

  function openAdd() {
    setEditId(null);
    setBlForm({ loanId: '', typeOfCompany: 'Private', sector: SECTORS[0], borrowerName: '', borrowerType: 'Large Corporate', borrowerRegNo: '', city: '', country: 'Kenya', loanAmount: '', loanTenure: '', loanStartDate: '', loanEndDate: '', remarks: '' });
    setModalOpen(true);
  }

  function handleSubmit() {
    if (editId) {
      setBlData(prev => prev.map(r => r.loanId === editId ? { ...r, borrowerName: blForm.borrowerName, city: blForm.city, loanAmount: Number(blForm.loanAmount), loanTenure: Number(blForm.loanTenure) } : r));
    } else {
      const newRec: BusinessLoanConfig = {
        loanId: blForm.loanId || `BL-KE-${String(Date.now()).slice(-4)}`,
        typeOfCompany: blForm.typeOfCompany as 'Private' | 'Listed' | 'Cooperative',
        sector: blForm.sector, borrowerName: blForm.borrowerName,
        borrowerType: blForm.borrowerType as BusinessLoanConfig['borrowerType'],
        borrowerRegNo: blForm.borrowerRegNo, city: blForm.city, country: blForm.country,
        loanAmount: Number(blForm.loanAmount), loanTenure: Number(blForm.loanTenure),
        loanStartDate: blForm.loanStartDate, loanEndDate: blForm.loanEndDate, loanStatus: 'Active',
      };
      setBlData(prev => [newRec, ...prev]);
    }
    setModalOpen(false);
    toast.success(editId ? 'Loan record updated' : 'New loan record added');
  }

  const filteredBL = blData.filter(r => !search || r.borrowerName.toLowerCase().includes(search.toLowerCase()) || r.loanId.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>Loan Configuration</h2>
        <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>Configure and manage loan records for PCAF data capture</p>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {/* Tab bar */}
        <div style={{ borderBottom: "1px solid #e2e8f0", background: "#fff", padding: "0 16px" }}>
          <div className="flex">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} className={tab === t ? 'tab-btn-active' : 'tab-btn'}>{t}</button>
            ))}
          </div>
        </div>

        {/* Actions + Search bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, padding: "12px 20px", borderBottom: "1px solid #e2e8f0", background: "#fff" }}>
          <div style={{ position: "relative", marginRight: 4 }}>
            <IconSearch size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
              className="field-input !py-1.5 !text-xs pl-7 w-52"
            />
          </div>
          <div className="w-px h-5 bg-slate-200" />
          <button className="btn btn-cyan btn-sm"><IconUpload size={14} /> Import Data</button>
          <button onClick={openAdd} className="btn btn-primary btn-sm"><IconPlus size={14} /> Add New</button>
        </div>

        {/* Tables */}
        <div style={{ overflowX: "auto" }}>
          {tab === 'Business Loans' && (
            <table className="data-table">
              <thead><tr>{['Loan ID', 'Borrower Name', 'Type', 'Sector', 'Borrower Type', 'City', 'Country', 'Reg No.', 'Loan Amount', 'Tenure', 'Start Date', 'End Date', 'Status', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
              <tbody>
                {filteredBL.map(r => (
                  <tr key={r.loanId} style={{ transition: "background 0.12s" }} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="#f8fafc"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=""}>
                    <td style={{ padding: "10px 12px", fontSize: 12, fontWeight: 500, fontFamily: "monospace", color: "#0369a1" }}>{r.loanId}</td>
                    <td style={{ padding: "10px 12px", fontSize: 14, fontWeight: 500, color: "#1e293b" }}>{r.borrowerName}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#475569" }}>{r.typeOfCompany}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#475569", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.sector}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#475569" }}>{r.borrowerType}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#475569" }}>{r.city}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#475569" }}>{r.country}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>{r.borrowerRegNo}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>${r.loanAmount.toLocaleString()}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.loanTenure}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b" }}>{r.loanStartDate}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b" }}>{r.loanEndDate}</td>
                    <td style={{ padding: "10px 12px" }}><StatusBadge status={r.loanStatus} /></td>
                    <td style={{ padding: "10px 12px" }}>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(r.loanId)} className="btn-icon" style={{ width: 28, height: 28, color: "#0284c7" }}><IconPencil size={13} /></button>
                        <button className="btn-icon" style={{ width: 28, height: 28, color: "#fb7185" }}><IconTrash size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === 'Commercial Real Estate' && (
            <table className="data-table">
              <thead><tr>{['Loan ID', 'Borrower Name', 'Type', 'Sector', 'Prop. ID', 'Year Built', 'Category', 'Prop. Type', 'Floors', 'Location', 'Country', 'Prop. Value', 'Floor Area', 'Loan Amount', 'Tenure', 'Start', 'End', 'Status', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
              <tbody>{MOCK_CRE_CONFIG.map(r => (
                <tr key={r.loanId} >
                  <td style={{ padding: "10px 12px", fontSize: 12, fontWeight: 500, fontFamily: "monospace", color: "#0369a1" }}>{r.loanId}</td>
                  <td style={{ padding: "10px 12px", fontSize: 14, fontWeight: 500, color: "#1e293b" }}>{r.borrowerName}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.borrowerType}</td><td style={{ padding: "10px 12px", fontSize: 12 }}>{r.sector}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.propertyId}</td><td style={{ padding: "10px 12px", fontSize: 12 }}>{r.yearBuilt}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.propertyCategory}</td><td style={{ padding: "10px 12px", fontSize: 12 }}>{r.propertyType}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.totalFloors}</td><td style={{ padding: "10px 12px", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.propertyLocation}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.country}</td><td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>${r.propertyValue.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.floorAreaFinanced}</td><td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>${r.loanAmount.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.loanTenure}</td><td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b" }}>{r.loanStartDate}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b" }}>{r.loanEndDate}</td><td style={{ padding: "10px 12px" }}><StatusBadge status={r.loanStatus} /></td>
                  <td style={{ padding: "10px 12px" }}><div className="flex gap-1"><button className="btn-icon" style={{ width: 28, height: 28, color: "#0284c7" }}><IconPencil size={13} /></button><button className="btn-icon" style={{ width: 28, height: 28, color: "#fb7185" }}><IconTrash size={13} /></button></div></td>
                </tr>
              ))}</tbody>
            </table>
          )}
          {tab === 'Motor Vehicle' && (
            <table className="data-table">
              <thead><tr>{['Loan ID', 'Borrower Name', 'Type', 'Sector', 'Vehicle Type', 'Veh. Number', 'Make & Model', 'Fuel Type', 'Veh. Value', 'Loan Amount', 'Start Date', 'End Date', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
              <tbody>{MOCK_MV_CONFIG.map(r => (
                <tr key={r.loanId} >
                  <td style={{ padding: "10px 12px", fontSize: 12, fontWeight: 500, fontFamily: "monospace", color: "#0369a1" }}>{r.loanId}</td>
                  <td style={{ padding: "10px 12px", fontSize: 14, fontWeight: 500, color: "#1e293b" }}>{r.borrowerName}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.borrowerType}</td><td style={{ padding: "10px 12px", fontSize: 12 }}>{r.sector || '—'}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.vehicleType}</td><td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.vehicleNumber}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.vehicleMakeModel}</td><td style={{ padding: "10px 12px", fontSize: 12 }}>{r.fuelType}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>${r.vehicleValue.toLocaleString()}</td><td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>${r.loanAmount.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b" }}>{r.loanStartDate}</td><td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b" }}>{r.loanEndDate}</td>
                  <td style={{ padding: "10px 12px" }}><div className="flex gap-1"><button className="btn-icon" style={{ width: 28, height: 28, color: "#0284c7" }}><IconPencil size={13} /></button><button className="btn-icon" style={{ width: 28, height: 28, color: "#fb7185" }}><IconTrash size={13} /></button></div></td>
                </tr>
              ))}</tbody>
            </table>
          )}
          {tab === 'Mortgage' && (
            <table className="data-table">
              <thead><tr>{['Loan ID', 'Borrower Name', 'Type', 'Sector', 'Building', 'Year Built', 'Prop. Type', 'Location', 'Country', 'Reg No.', 'Prop. Value', 'Floor Area', 'Loan Amount', 'Tenure', 'Start', 'End', 'Status', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
              <tbody>{MOCK_MORTGAGE_CONFIG.map(r => (
                <tr key={r.loanId} >
                  <td style={{ padding: "10px 12px", fontSize: 12, fontWeight: 500, fontFamily: "monospace", color: "#0369a1" }}>{r.loanId}</td>
                  <td style={{ padding: "10px 12px", fontSize: 14, fontWeight: 500, color: "#1e293b" }}>{r.borrowerName}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.borrowerType}</td><td style={{ padding: "10px 12px", fontSize: 12 }}>{r.sector}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.buildingName}</td><td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.yearBuilt}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.propertyType}</td><td style={{ padding: "10px 12px", fontSize: 12 }}>{r.propertyLocation}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.country}</td><td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>{r.borrowerRegNo}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>${r.propertyValue.toLocaleString()}</td><td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.floorArea}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>${r.loanAmount.toLocaleString()}</td><td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.loanTenure}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b" }}>{r.loanStartDate}</td><td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b" }}>{r.loanEndDate}</td>
                  <td style={{ padding: "10px 12px" }}><StatusBadge status={r.loanStatus} /></td>
                  <td style={{ padding: "10px 12px" }}><div className="flex gap-1"><button className="btn-icon" style={{ width: 28, height: 28, color: "#0284c7" }}><IconPencil size={13} /></button><button className="btn-icon" style={{ width: 28, height: 28, color: "#fb7185" }}><IconTrash size={13} /></button></div></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Form Modal */}
      {modalOpen && tab === 'Business Loans' && (
        <Modal title={editId ? `Edit Loan — ${blForm.loanId}` : 'Add New Business Loan'} onClose={() => setModalOpen(false)} size="xl"
          footer={<><button onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button><button onClick={handleSubmit} className="btn btn-primary">{editId ? 'Save Changes' : 'Submit'}</button></>}>
          <FormSection title="Loan Identification" />
          <FormRow cols={3}>
            <Input label="Loan ID" value={blForm.loanId} onChange={setF('loanId')} required />
            <Select label="Type of Company" value={blForm.typeOfCompany} onChange={setF('typeOfCompany')} options={['Private', 'Listed', 'Cooperative']} required />
            <Select label="Sector" value={blForm.sector} onChange={setF('sector')} options={SECTORS} />
          </FormRow>
          <FormRow cols={3}>
            <Input label="Borrower Name" value={blForm.borrowerName} onChange={setF('borrowerName')} required />
            <Select label="Borrower Type" value={blForm.borrowerType} onChange={setF('borrowerType')} options={['Large Corporate', 'SME', 'MSME', 'Individual', 'Cooperative']} required />
            <Input label="Borrower Registration No." value={blForm.borrowerRegNo} onChange={setF('borrowerRegNo')} />
          </FormRow>
          <FormRow cols={2}>
            <Input label="City" value={blForm.city} onChange={setF('city')} />
            <Input label="Country" value={blForm.country} onChange={setF('country')} />
          </FormRow>
          <FormSection title="Loan Terms" />
          <FormRow cols={4}>
            <Input label="Loan Amount (USD)" value={blForm.loanAmount} onChange={setF('loanAmount')} />
            <Input label="Loan Tenure (Months)" value={blForm.loanTenure} onChange={setF('loanTenure')} />
            <Input label="Loan Start Date" value={blForm.loanStartDate} onChange={setF('loanStartDate')} type="date" />
            <Input label="Loan End Date" value={blForm.loanEndDate} onChange={setF('loanEndDate')} type="date" />
          </FormRow>
          <Textarea label="Remarks" value={blForm.remarks} onChange={setF('remarks')} rows={3} />
        </Modal>
      )}
    </div>
  );
}
