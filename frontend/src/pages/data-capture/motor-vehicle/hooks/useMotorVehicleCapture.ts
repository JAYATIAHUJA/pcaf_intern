import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiJson, apiRequest } from '../../../../lib/api';
import type { MotorVehicleCapture, DQOption } from '../../../../types';
import { CAPTURE_STATUS, type TabKey } from '../../../../constants/captureStatuses';
import { API_PATHS } from '../../../../constants/apiPaths';
import {
  calculateMotorVehicleEmissionsOption1a,
  calculateMotorVehicleEmissionsOption1b,
  calculateMotorVehicleEmissionsOption2a,
  calculateMotorVehicleEmissionsOption2b,
  calculateMotorVehicleEmissionsOption3a,
} from '../../../../utils/pcafCalculations';

export type { TabKey } from '../../../../constants/captureStatuses';

export interface MotorVehicleFormState {
  loanId: string;
  borrowerName: string;
  borrowerType: string;
  vehicleType: string;
  fuelType: string;
  vehicleMakeModel: string;
  vehicleNumber: string;
  sector: string;
  yearOfManufacture: string;
  originalValue: string;
  loanAmount: string;
  loanStartDate: string;
  loanEndDate: string;
  activityPeriod: string;
  outstandingAmount: string;
  dataQuality: DQOption | '';
  actualFuelConsumption: string;
  fuelEmissionFactor: string;
  actualDistance: string;
  emissionFactor: string;
  estimatedDistance: string;
  fuelEfficiency: string;
  averageDistance: string;
  defaultEmissionFactor: string;
  defaultIntensityFactor: string;
}

export const BLANK_MV: MotorVehicleFormState = {
  loanId: '', borrowerName: '', borrowerType: 'Individual',
  vehicleType: '', fuelType: 'Petrol', vehicleMakeModel: '', vehicleNumber: '',
  sector: '', yearOfManufacture: '', originalValue: '',
  loanAmount: '', loanStartDate: '', loanEndDate: '',
  activityPeriod: '', outstandingAmount: '', dataQuality: '',
  actualFuelConsumption: '', fuelEmissionFactor: '',
  actualDistance: '', emissionFactor: '',
  estimatedDistance: '', fuelEfficiency: '',
  averageDistance: '', defaultEmissionFactor: '',
  defaultIntensityFactor: '',
};

export function getMotorVehicleEmissionsFromForm(form: MotorVehicleFormState): number {
  const outstanding = Number(form.outstandingAmount || 0);
  const originalValue = Number(form.originalValue || 1);

  if (form.dataQuality === '1a') {
    const fuel = Number(form.actualFuelConsumption || 0);
    const factor = Number(form.fuelEmissionFactor || 0);
    return calculateMotorVehicleEmissionsOption1a(outstanding, originalValue, fuel, factor);
  } else if (form.dataQuality === '1b') {
    const distance = Number(form.actualDistance || 0);
    const factor = Number(form.emissionFactor || 0);
    return calculateMotorVehicleEmissionsOption1b(outstanding, originalValue, distance, factor);
  } else if (form.dataQuality === '2a') {
    const distance = Number(form.estimatedDistance || 0);
    const efficiency = Number(form.fuelEfficiency || 0);
    const factor = Number(form.fuelEmissionFactor || 0);
    return calculateMotorVehicleEmissionsOption2a(outstanding, originalValue, distance, efficiency, factor);
  } else if (form.dataQuality === '2b') {
    const distance = Number(form.averageDistance || 0);
    const factor = Number(form.defaultEmissionFactor || 0);
    return calculateMotorVehicleEmissionsOption2b(outstanding, originalValue, distance, factor);
  } else if (form.dataQuality === '3a') {
    const factor = Number(form.defaultIntensityFactor || 0);
    return calculateMotorVehicleEmissionsOption3a(outstanding, factor);
  }
  return 0;
}

export function useMotorVehicleCapture() {
  const [tab, setTab] = useState<TabKey>('Pending');
  const [records, setRecords] = useState<MotorVehicleCapture[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [auditLoanId, setAuditLoanId] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<MotorVehicleCapture | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [form, setForm] = useState<MotorVehicleFormState>(BLANK_MV);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecords = () => {
    setIsLoading(true);
    apiJson<MotorVehicleCapture[]>('/data-capture')
      .then(data => {
        setRecords(data.filter(r => r.assetClass === 'Motor Vehicle'));
      })
      .catch(error => {
        console.error(error);
        toast.error((error as Error).message || 'Failed to fetch capture records');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const setF = (k: keyof MotorVehicleFormState) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const totalEmissions = records.reduce((s, r) => s + r.financedEmissions, 0);

  const counts: Record<TabKey, number> = {
    Pending:  records.filter(r => r.status === CAPTURE_STATUS.PENDING_FOR_CAPTURE || r.status === CAPTURE_STATUS.SUBMITTED_PENDING).length,
    Draft:    records.filter(r => r.status === CAPTURE_STATUS.PENDING_FOR_CAPTURE).length,
    Rejected: records.filter(r => r.status === CAPTURE_STATUS.REJECTED).length,
    Approved: records.filter(r => r.status === CAPTURE_STATUS.APPROVED).length,
  };

  const shown = records.filter(r => {
    const matchTab =
      tab === 'Approved' ? r.status === CAPTURE_STATUS.APPROVED :
      tab === 'Draft'    ? r.status === CAPTURE_STATUS.PENDING_FOR_CAPTURE :
      tab === 'Rejected' ? r.status === CAPTURE_STATUS.REJECTED :
      (r.status === CAPTURE_STATUS.PENDING_FOR_CAPTURE || r.status === CAPTURE_STATUS.SUBMITTED_PENDING);
    const matchSearch = !search || r.loanId.toLowerCase().includes(search.toLowerCase());
    const matchDate = tab === 'Approved'
      ? (!dateFrom || r.activityPeriod >= dateFrom) && (!dateTo || r.activityPeriod <= dateTo)
      : true;
    return matchTab && matchSearch && matchDate;
  });

  function openEdit(rec: MotorVehicleCapture) {
    setEditRecord(rec);
    setForm({
      loanId:               rec.loanId,
      borrowerName:         rec.borrowerName        || '',
      borrowerType:         rec.borrowerType        || 'Individual',
      vehicleType:          rec.vehicleType         || '',
      fuelType:             rec.fuelType            || 'Petrol',
      vehicleMakeModel:     rec.vehicleMakeModel    || '',
      vehicleNumber:        rec.vehicleNumber       || '',
      sector:               rec.vehicleType === 'Light Commercial' ? 'Transportation' : '',
      yearOfManufacture:    String(rec.yearOfManufacture || ''),
      originalValue:        String(rec.originalValue     || ''),
      loanAmount:           String(rec.loanAmount        || ''),
      loanStartDate:        rec.loanStartDate       || '',
      loanEndDate:          rec.loanEndDate         || '',
      activityPeriod:       rec.activityPeriod,
      outstandingAmount:    String(rec.outstandingAmount || 0),
      dataQuality:          rec.dataQuality         ?? '',
      // Emissions fields — use stored values or empty string (never demo hardcodes)
      actualFuelConsumption: String(rec.actualFuelConsumption ?? ''),
      fuelEmissionFactor:    String(rec.fuelEmissionFactor    ?? ''),
      actualDistance:        String(rec.actualDistance         ?? ''),
      emissionFactor:        String(rec.emissionFactor         ?? ''),
      estimatedDistance:     String(rec.estimatedDistance      ?? ''),
      fuelEfficiency:        String(rec.fuelEfficiency         ?? ''),
      averageDistance:       String(rec.averageDistance        ?? ''),
      defaultEmissionFactor: String(rec.defaultEmissionFactor  ?? ''),
      defaultIntensityFactor:String(rec.defaultIntensityFactor ?? ''),
    });
    setModalOpen(true);
  }

  function handleSaveDraft() {
    if (!editRecord) return;
    const emissions = getMotorVehicleEmissionsFromForm(form);
    setIsLoading(true);
    apiRequest(API_PATHS.DATA_CAPTURE_BY_ID(editRecord.id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, financedEmissions: emissions, status: CAPTURE_STATUS.PENDING_FOR_CAPTURE }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to save draft');
        toast('Record saved as draft', { icon: '✏️' });
        fetchRecords();
      })
      .catch(err => toast.error((err as Error).message || 'Error saving draft'))
      .finally(() => { setIsLoading(false); setModalOpen(false); });
  }

  function handleSubmit() {
    if (!form.dataQuality) { toast.error('Please select a Data Quality score'); return; }
    if (!editRecord) return;
    const emissions = getMotorVehicleEmissionsFromForm(form);
    setIsLoading(true);
    apiRequest(API_PATHS.DATA_CAPTURE_BY_ID(editRecord.id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, financedEmissions: emissions, status: CAPTURE_STATUS.SUBMITTED_PENDING }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to submit record');
        toast.success(`Record ${form.loanId} submitted successfully`);
        fetchRecords();
      })
      .catch(err => toast.error((err as Error).message || 'Error submitting record'))
      .finally(() => { setIsLoading(false); setModalOpen(false); });
  }

  function handleApprove() {
    if (!selected.length) return;
    setIsLoading(true);
    apiRequest(API_PATHS.DATA_CAPTURE_APPROVE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selected }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to approve records');
        toast.success(`${selected.length} record${selected.length > 1 ? 's' : ''} approved`);
        setSelected([]);
        fetchRecords();
      })
      .catch(err => toast.error((err as Error).message || 'Failed to approve records'))
      .finally(() => setIsLoading(false));
  }

  function handleReject() {
    if (!selected.length) { toast.error('Select at least one record to reject'); return; }
    setIsLoading(true);
    apiRequest(API_PATHS.DATA_CAPTURE_REJECT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selected }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to reject records');
        toast.error(`${selected.length} record${selected.length > 1 ? 's' : ''} rejected`);
        setSelected([]);
        fetchRecords();
      })
      .catch(err => toast.error((err as Error).message || 'Failed to reject records'))
      .finally(() => setIsLoading(false));
  }

  const allSelected = shown.length > 0 && shown.every(r => selected.includes(String(r.id)));
  const toggleAll = () => setSelected(allSelected ? [] : shown.map(r => String(r.id)));

  return {
    tab,
    setTab,
    records,
    modalOpen,
    setModalOpen,
    auditLoanId,
    setAuditLoanId,
    editRecord,
    selected,
    setSelected,
    search,
    setSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    form,
    setForm,
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
    toggleAll,
    isLoading
  };
}
