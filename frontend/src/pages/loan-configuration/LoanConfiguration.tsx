import { IconPlus, IconSearch, IconUpload } from '@tabler/icons-react';
import { activeOptionValues } from '../../constants/masterData';
import { useMasterData } from '../../hooks/useMasterData';
import { useLoanConfiguration, TABS } from './hooks/useLoanConfiguration';

import MasterLoanConfigurationTable from './components/MasterLoanConfigurationTable';
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
  const { masterData } = useMasterData();
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
    filteredMaster,
    filteredBL,
    filteredCRE,
    filteredMV,
    filteredMG
  } = useLoanConfiguration();

  const sectors = activeOptionValues(masterData, 'sector');
  const companyTypes = activeOptionValues(masterData, 'company_type');
  const borrowerTypes = activeOptionValues(masterData, 'borrower_type');
  const countries = activeOptionValues(masterData, 'country');
  const cities = activeOptionValues(masterData, 'city');
  const permissions = JSON.parse(sessionStorage.getItem('auth_permissions') || '{}') as Record<string, string[]>;
  const loanPermissions = permissions['Loan Configuration'] || [];
  const role = sessionStorage.getItem('auth_role');
  const hasNoPermissionCache = Object.keys(permissions).length === 0;
  const canCreate = loanPermissions.includes('create') || (hasNoPermissionCache && role === 'Super Admin');
  const canDelete = loanPermissions.includes('delete') || (hasNoPermissionCache && role === 'Super Admin');
  const canManage = canCreate || canDelete;
  const visibleTabs = canManage ? TABS : TABS.filter(t => t === 'Master Table');

  return (
    <div style={{ padding: 24, background: '#f1f5f9', minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Loan Configuration</h2>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>Configure and manage loan records for PCAF data capture</p>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', background: '#fff', padding: '0 16px' }}>
          <div className="flex">
            {visibleTabs.map(t => (
              <button key={t} onClick={() => setTab(t)} className={tab === t ? 'tab-btn-active' : 'tab-btn'}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, padding: '12px 20px', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
          <div style={{ position: 'relative', marginRight: 4 }}>
            <IconSearch size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="field-input !py-1.5 !text-xs pl-7 w-52" />
          </div>
          {canCreate && <button onClick={() => setImportModalOpen(true)} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IconUpload size={14} /> Import CSV</button>}
          {canCreate && <button onClick={openAdd} className="btn btn-primary btn-sm"><IconPlus size={14} /> Add New</button>}
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 14 }}>Loading configurations from database...</div>
          ) : (
            <>
              {tab === 'Master Table' && <MasterLoanConfigurationTable records={filteredMaster} onDelete={handleDelete} canManage={canManage} />}
              {canManage && tab === 'Business Loans' && <BusinessLoansTable records={filteredBL} onEdit={openEdit} onDelete={handleDelete} />}
              {canManage && tab === 'Commercial Real Estate' && <CommercialRETable records={filteredCRE} onDelete={handleDelete} />}
              {canManage && tab === 'Motor Vehicle' && <MotorVehicleTable records={filteredMV} onDelete={handleDelete} />}
              {canManage && tab === 'Mortgage' && <MortgageTable records={filteredMG} onDelete={handleDelete} />}
            </>
          )}
        </div>
      </div>

      <BusinessLoanModal
        isOpen={modalOpen}
        editId={editId}
        formData={blForm}
        setFormData={setBlForm}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        sectors={sectors.length ? sectors : SECTORS}
        companyTypes={companyTypes}
        borrowerTypes={borrowerTypes}
        countries={countries}
        cities={cities}
      />

      <ImportCsvModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSuccess={fetchConfigs}
        masterData={masterData}
      />
    </div>
  );
}

