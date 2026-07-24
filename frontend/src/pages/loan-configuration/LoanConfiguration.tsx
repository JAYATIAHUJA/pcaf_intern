import { IconPlus, IconSearch, IconUpload } from '@tabler/icons-react';
import { useLoanConfiguration, TABS } from './hooks/useLoanConfiguration';

import BusinessLoansTable from './components/BusinessLoansTable';
import CommercialRETable from './components/CommercialRETable';
import MotorVehicleTable from './components/MotorVehicleTable';
import MortgageTable from './components/MortgageTable';
import BusinessLoanModal from './components/BusinessLoanModal';
import ImportCsvModal from './components/ImportCsvModal';

const SECTORS = [
  'Agriculture, Forestry & Fishing', 
  'Manufacturing', 
  'Energy & Power', 
  'Transportation & Storage', 
  'Wholesale & Retail Trade', 
  'Construction & Real Estate', 
  'Tourism & Hospitality', 
  'Information Technology'
];

export default function LoanConfiguration() {
  const {
    tab,
    setTab,
    modalOpen,
    setModalOpen,
    importModalOpen,
    setImportModalOpen,
    editId,
    search,
    setSearch,
    loading,
    blForm,
    setBlForm,
    fetchConfigs,
    openEdit,
    openAdd,
    handleSubmit,
    handleDelete,
    filteredBL,
    filteredCRE,
    filteredMV,
    filteredMG
  } = useLoanConfiguration();

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
              placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="field-input !py-1.5 !text-xs pl-7 w-52"
            />
          </div>
          <button onClick={() => setImportModalOpen(true)} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IconUpload size={14} /> Import CSV</button>
          <button onClick={openAdd} className="btn btn-primary btn-sm"><IconPlus size={14} /> Add New</button>
        </div>

        {/* Tables */}
        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 14 }}>
              Loading configurations from database...
            </div>
          ) : (
            <>
              {tab === 'Business Loans' && (
                <BusinessLoansTable records={filteredBL} onEdit={openEdit} onDelete={handleDelete} />
              )}
              {tab === 'Commercial Real Estate' && (
                <CommercialRETable records={filteredCRE} onDelete={handleDelete} />
              )}
              {tab === 'Motor Vehicle' && (
                <MotorVehicleTable records={filteredMV} onDelete={handleDelete} />
              )}
              {tab === 'Mortgage' && (
                <MortgageTable records={filteredMG} onDelete={handleDelete} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <BusinessLoanModal
        isOpen={modalOpen}
        editId={editId}
        formData={blForm}
        setFormData={setBlForm}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        sectors={SECTORS}
      />

      <ImportCsvModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSuccess={fetchConfigs}
      />
    </div>
  );
}
