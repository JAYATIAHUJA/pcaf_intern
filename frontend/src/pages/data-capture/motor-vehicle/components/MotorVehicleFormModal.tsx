import React from 'react';
import { Modal } from '../../../../components/ui';
import { Input, MonthPicker, DQRadioGroup, FormRow, FormSection } from '../../../../components/form';
import { MotorVehicleFormState, getMotorVehicleEmissionsFromForm } from '../hooks/useMotorVehicleCapture';

interface MotorVehicleFormModalProps {
  onClose: () => void;
  form: MotorVehicleFormState;
  setF: (k: keyof MotorVehicleFormState) => (v: string) => void;
  handleSaveDraft: () => void;
  handleSubmit: () => void;
}

const DQ_OPTIONS = [
  { value: '1a', label: 'Option 1a' },
  { value: '1b', label: 'Option 1b' },
  { value: '2a', label: 'Option 2a' },
  { value: '2b', label: 'Option 2b' },
  { value: '3a', label: 'Option 3a' }
];

const DQ_DESC: Record<string, string> = {
  '1a': 'Score 1a - Actual Fuel Consumption Based (Fuel consumed * Fuel emission factor)',
  '1b': 'Score 1b - Actual Distance Covered Based (Distance covered * Vehicle-specific EF)',
  '2a': 'Score 2a - Fuel Efficiency Factor Based (Estimated distance * Fuel efficiency * Fuel EF)',
  '2b': 'Score 2b - Average Mileage by Vehicle Type (Average annual distance * Class EF)',
  '3a': 'Score 3a - Default Factor Based (Outstanding balance * Default intensity factor)'
};

export function MotorVehicleFormModal({
  onClose, form, setF, handleSaveDraft, handleSubmit
}: MotorVehicleFormModalProps) {
  const calculatedEmissions = getMotorVehicleEmissionsFromForm(form);
  const attributionPct = (Number(form.outstandingAmount || 0) / Number(form.originalValue || 1)) * 100;

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
            {calculatedEmissions.toFixed(4)} <span style={{ fontSize: 14, fontWeight: 500, color: '#16a34a' }}>tCO2e</span>
          </h4>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
            Attribution Factor: {attributionPct.toFixed(3)}%
          </div>
          <div style={{ fontSize: 11, color: '#15803d', marginTop: 2 }}>
            Outstanding / Original Value
          </div>
        </div>
      </div>

      <FormSection title="Loan & Vehicle Information" />
      <FormRow cols={3}>
        <Input label="Loan ID" value={form.loanId} readOnly required />
        <Input label="Borrower Name" value={form.borrowerName} readOnly required />
        <Input label="Borrower Type" value={form.borrowerType} readOnly required />
      </FormRow>
      <FormRow cols={4}>
        <Input label="Vehicle Type" value={form.vehicleType} readOnly required />
        <Input label="Fuel Type" value={form.fuelType} readOnly required />
        <Input label="Vehicle Make & Model" value={form.vehicleMakeModel} readOnly required />
        <Input label="Vehicle Number" value={form.vehicleNumber} readOnly required />
      </FormRow>
      <FormRow cols={3}>
        <Input label="Sector" value={form.sector} onChange={setF('sector')} required />
        <Input label="Year of Manufacture" value={form.yearOfManufacture} readOnly required />
        <Input label="Original Value (USD)" value={form.originalValue} readOnly required />
      </FormRow>

      <FormSection title="Loan Terms" />
      <FormRow cols={3}>
        <Input label="Loan Amount (USD)" value={form.loanAmount} readOnly required />
        <Input label="Loan Start Date" value={form.loanStartDate} type="date" readOnly required />
        <Input label="Loan End Date" value={form.loanEndDate} type="date" readOnly required />
      </FormRow>

      <FormSection title="Activity & Emissions" />
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

      {/* Option 1a: Actual Fuel Consumption */}
      {form.dataQuality === '1a' && (
        <>
          <FormSection title="Actual Fuel Consumption Input (Option 1a)" />
          <FormRow cols={2}>
            <Input label="Actual Fuel Consumption (Liters or kWh)" value={form.actualFuelConsumption} onChange={setF('actualFuelConsumption')} required />
            <Input label="Fuel Emission Factor (kg CO2e / unit)" value={form.fuelEmissionFactor} onChange={setF('fuelEmissionFactor')} required />
          </FormRow>
        </>
      )}

      {/* Option 1b: Actual Distance Covered */}
      {form.dataQuality === '1b' && (
        <>
          <FormSection title="Actual Distance Covered Input (Option 1b)" />
          <FormRow cols={2}>
            <Input label="Actual Distance Covered (km)" value={form.actualDistance} onChange={setF('actualDistance')} required />
            <Input label="Vehicle-Specific Emission Factor (g CO2e / km)" value={form.emissionFactor} onChange={setF('emissionFactor')} required />
          </FormRow>
        </>
      )}

      {/* Option 2a: Fuel Efficiency and Distance */}
      {form.dataQuality === '2a' && (
        <>
          <FormSection title="Fuel Efficiency-Based Input (Option 2a)" />
          <FormRow cols={3}>
            <Input label="Estimated Distance Covered (km)" value={form.estimatedDistance} onChange={setF('estimatedDistance')} required />
            <Input label="Vehicle Fuel Efficiency (Liters / 100km)" value={form.fuelEfficiency} onChange={setF('fuelEfficiency')} required />
            <Input label="Fuel Emission Factor (kg CO2e / Liter)" value={form.fuelEmissionFactor} onChange={setF('fuelEmissionFactor')} required />
          </FormRow>
        </>
      )}

      {/* Option 2b: Average Mileage by Vehicle Type */}
      {form.dataQuality === '2b' && (
        <>
          <FormSection title="Average Mileage-Based Input (Option 2b)" />
          <FormRow cols={2}>
            <Input label="Average Annual Distance (km)" value={form.averageDistance} onChange={setF('averageDistance')} required />
            <Input label="Default Class Emission Factor (g CO2e / km)" value={form.defaultEmissionFactor} onChange={setF('defaultEmissionFactor')} required />
          </FormRow>
        </>
      )}

      {/* Option 3a: Default Factor */}
      {form.dataQuality === '3a' && (
        <>
          <FormSection title="Default Default Intensity Input (Option 3a)" />
          <FormRow cols={1}>
            <Input label="Default Emission Intensity (tCO2e / $M asset)" value={form.defaultIntensityFactor} onChange={setF('defaultIntensityFactor')} required />
          </FormRow>
        </>
      )}
    </Modal>
  );
}
