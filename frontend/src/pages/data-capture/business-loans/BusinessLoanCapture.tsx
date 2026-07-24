import React from 'react';
import { useBusinessLoanCapture } from './hooks/useBusinessLoanCapture';
import { BusinessLoanKpis } from './components/BusinessLoanKpis';
import { BusinessLoanTable } from './components/BusinessLoanTable';
import { BusinessLoanFormModal } from './components/BusinessLoanFormModal';
import { AuditHistoryModal } from '../../../components/form/AuditHistoryModal';

export default function BusinessLoanCapturePage() {
  const {
    tab,
    setTab,
    modalOpen,
    setModalOpen,
    auditLoanId,
    setAuditLoanId,
    selected,
    setSelected,
    search,
    setSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    form,
    setF,
    totalEmissions,
    counts,
    shown,
    openEdit,
    handleSaveDraft,
    handleSubmit,
    handleApprove,
    handleReject,
    allSelected,
    toggleAll
  } = useBusinessLoanCapture();

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%" }}>
      <div className="page-header">
        <h2>Business Loan</h2>
        <p>PCAF Data Capture - Attribution: Outstanding / EVIC</p>
      </div>

      <BusinessLoanKpis totalEmissions={totalEmissions} />

      <BusinessLoanTable
        tab={tab}
        setTab={setTab}
        shown={shown}
        counts={counts}
        selected={selected}
        setSelected={setSelected}
        search={search}
        setSearch={setSearch}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        allSelected={allSelected}
        toggleAll={toggleAll}
        openEdit={openEdit}
        setAuditLoanId={setAuditLoanId}
        handleApprove={handleApprove}
        handleReject={handleReject}
      />

      {modalOpen && (
        <BusinessLoanFormModal
          onClose={() => setModalOpen(false)}
          form={form}
          setF={setF}
          handleSaveDraft={handleSaveDraft}
          handleSubmit={handleSubmit}
        />
      )}

      {auditLoanId && (
        <AuditHistoryModal 
          loanId={auditLoanId} 
          onClose={() => setAuditLoanId(null)} 
        />
      )}
    </div>
  );
}
