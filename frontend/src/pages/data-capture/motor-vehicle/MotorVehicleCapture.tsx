import React from 'react';
import { useMotorVehicleCapture } from './hooks/useMotorVehicleCapture';
import { MotorVehicleKpis } from './components/MotorVehicleKpis';
import { MotorVehicleTable } from './components/MotorVehicleTable';
import { MotorVehicleFormModal } from './components/MotorVehicleFormModal';
import { AuditHistoryModal } from '../../../components/form/AuditHistoryModal';

export default function MotorVehicleCapturePage() {
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
  } = useMotorVehicleCapture();

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%" }}>
      <div className="page-header">
        <h2>Motor Vehicle Loans</h2>
        <p>PCAF Data Capture - Attribution: Outstanding Balance / Original Value</p>
      </div>

      <MotorVehicleKpis totalEmissions={totalEmissions} />

      <MotorVehicleTable
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
        <MotorVehicleFormModal
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
