import React from 'react';
import { Modal } from '../../../../components/ui';
import { Input, Select, MonthPicker, DQRadioGroup, FormRow, FormSection } from '../../../../components/form';
import { FormState, getBusinessLoanEmissionsFromForm } from '../hooks/useBusinessLoanCapture';

interface BusinessLoanFormModalProps {
  onClose: () => void;
  form: FormState;
  setF: (k: keyof FormState) => (v: string) => void;
  handleSaveDraft: () => void;
  handleSubmit: () => void;
}

const SECTORS = ['Agriculture, Forestry & Fishing', 'Manufacturing', 'Energy & Power', 'Transportation & Storage', 'Wholesale & Retail Trade', 'Construction & Real Estate', 'Tourism & Hospitality'];
const DQ_OPTIONS = [
  { value: '1a', label: 'Option 1a' },
  { value: '1b', label: 'Option 1b' },
  { value: '2a', label: 'Option 2a' },
  { value: '2b', label: 'Option 2b' },
  { value: '3a', label: 'Option 3a' }
];
const DQ_DESC: Record<string, string> = {
  '1a': 'Score 1a - Verified company emissions (Scope 1, 2, and 3 reported)',
  '1b': 'Score 1b - Reported company emissions (Scope 1, 2, and 3 reported)',
  '2a': 'Score 2a - Estimated using company revenue and sector emission factor',
  '2b': 'Score 2b - Estimated using company EBIT and sector emission factor',
  '3a': 'Score 3a - Estimated using outstanding amount and sector average emission intensity'
};

export function BusinessLoanFormModal({
  onClose, form, setF, handleSaveDraft, handleSubmit
}: BusinessLoanFormModalProps) {
  const calculatedEmissions = getBusinessLoanEmissionsFromForm(form);
  const attributionPct = ((Number(form.outstandingAmount || 0) / (Number(form.totalEquity || 0) + Number(form.totalDebt || 0) || 1)) * 100);

  return (
    <Modal
      title={`Activity Detail - ${form.loanId}`}
      onClose={onClose}
      size="xl"
      footer={
        <>
          <button onClick={handleSaveDraft} className="btn btn-secondary">Save as Draft</button>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn btn-cyan">Cancel</button>
            <button 
              onClick={handleSubmit} 
              className="btn" 
              style={{ background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
            >
              Submit
            </button>
          </div>
        </>
      }
    >
      {/* Live Emissions Summary Banner */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'linear-gradient(90deg, #f0fdf4 0%, #e6fcf5 100%)', 
        border: '1px solid #bbf7d0', 
        borderRadius: 10, 
        padding: '16px 20px', 
        marginBottom: 20 
      }}>
        <div>
          <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PCAF Live Financed Emissions</span>
          <h4 style={{ fontSize: 24, fontWeight: 800, color: '#14532d', marginTop: 4 }}>
            {calculatedEmissions.toFixed(2)} <span style={{ fontSize: 14, fontWeight: 500, color: '#16a34a' }}>tCO2e</span>
          </h4>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
            Attribution Factor: {attributionPct.toFixed(3)}%
          </div>
          <div style={{ fontSize: 11, color: '#15803d', marginTop: 2 }}>
            Outstanding / (Equity + Debt)
          </div>
        </div>
      </div>

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

      <FormSection title="Financial & Capital structure" />
      <FormRow cols={2}>
        <Input label="Total Equity (USD)" value={form.totalEquity} onChange={setF('totalEquity')} required />
        <Input label="Total Debt (USD)" value={form.totalDebt} onChange={setF('totalDebt')} required />
      </FormRow>

      <FormSection title="Loan Terms" />
      <FormRow cols={4}>
        <Input label="Loan Amount (USD)" value={form.loanAmount} readOnly required />
        <Input label="Loan Tenure (Months)" value={form.loanTenure} readOnly required />
        <Input label="Loan Start Date" value={form.loanStartDate} onChange={setF('loanStartDate')} type="date" required />
        <Input label="Loan End Date" value={form.loanEndDate} onChange={setF('loanEndDate')} type="date" required />
      </FormRow>

      <FormSection title="Activity Period & Outstanding" />
      <FormRow cols={2}>
        <MonthPicker label="Activity Period" value={form.activityPeriod} onChange={setF('activityPeriod')} required />
        <Input label="Outstanding Amount (USD)" value={form.outstandingAmount} onChange={setF('outstandingAmount')} required />
      </FormRow>

      <FormSection title="Data Quality Score & PCAF Inputs" />
      <div className="mb-4">
        <label className="field-label mb-2">Select Data Quality Option<span className="text-rose-500 ml-0.5">*</span></label>
        <DQRadioGroup value={form.dataQuality} onChange={setF('dataQuality')} options={DQ_OPTIONS} />
        {form.dataQuality && (
          <div className="mt-2 px-3 py-2 bg-sky-50 rounded-lg text-xs text-sky-700 font-medium">{DQ_DESC[form.dataQuality]}</div>
        )}
      </div>

      {/* Conditional Inputs based on DQ Option Selection */}
      {(form.dataQuality === '1a' || form.dataQuality === '1b') && (
        <>
          <FormSection title="Company Emissions Input (Option 1)" />
          <FormRow cols={3}>
            <Input label="Scope 1 Emissions (tCO2e)" value={form.scope1Emissions} onChange={setF('scope1Emissions')} required />
            <Input label="Scope 2 Emissions (tCO2e)" value={form.scope2Emissions} onChange={setF('scope2Emissions')} required />
            <Input label="Scope 3 Emissions (tCO2e)" value={form.scope3Emissions} onChange={setF('scope3Emissions')} />
          </FormRow>
        </>
      )}

      {form.dataQuality === '2a' && (
        <>
          <FormSection title="Revenue-Based Estimation Input (Option 2a)" />
          <FormRow cols={2}>
            <Input label="Company Annual Revenue (USD)" value={form.companyRevenue} onChange={setF('companyRevenue')} required />
            <Input label="Sector Emission intensity Factor (tCO2e / $M Revenue)" value={form.sectorEmissionIntensity} onChange={setF('sectorEmissionIntensity')} required />
          </FormRow>
        </>
      )}

      {form.dataQuality === '2b' && (
        <>
          <FormSection title="EBIT-Based Estimation Input (Option 2b)" />
          <FormRow cols={2}>
            <Input label="Company Annual EBIT (USD)" value={form.companyEbit} onChange={setF('companyEbit')} required />
            <Input label="Sector Emission intensity Factor (tCO2e / $M EBIT)" value={form.sectorEmissionIntensity} onChange={setF('sectorEmissionIntensity')} required />
          </FormRow>
        </>
      )}

      {form.dataQuality === '3a' && (
        <>
          <FormSection title="Asset/Outstanding-Based Default Input (Option 3a)" />
          <FormRow cols={1}>
            <Input label="Sector Average Emission Intensity (tCO2e / $M asset)" value={form.sectorAverageIntensity} onChange={setF('sectorAverageIntensity')} required />
          </FormRow>
        </>
      )}
    </Modal>
  );
}
