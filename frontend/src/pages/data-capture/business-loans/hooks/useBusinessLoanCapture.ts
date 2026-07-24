import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiJson, apiRequest } from '../../../../lib/api';
import type { BusinessLoanCapture, DQOption } from '../../../../types';
import { CAPTURE_STATUS, type TabKey } from '../../../../constants/captureStatuses';
import { API_PATHS } from '../../../../constants/apiPaths';
import {
  calculateBusinessLoanEmissionsOption1,
  calculateBusinessLoanEmissionsOption2,
  calculateBusinessLoanEmissionsOption3,
} from '../../../../utils/pcafCalculations';

export type { TabKey } from '../../../../constants/captureStatuses';

export interface FormState {
  loanId: string;
  typeOfCompany: string;
  sector: string;
  borrowerName: string;
  borrowerType: string;
  borrowerRegNo: string;
  city: string;
  country: string;
  loanAmount: string;
  loanTenure: string;
  loanStartDate: string;
  loanEndDate: string;
  totalEquity: string;
  totalDebt: string;
  activityPeriod: string;
  outstandingAmount: string;
  dataQuality: DQOption | '';
  scope1Emissions: string;
  scope2Emissions: string;
  scope3Emissions: string;
  companyRevenue: string;
  companyEbit: string;
  sectorEmissionIntensity: string;
  sectorAverageIntensity: string;
}

const SECTORS = ['Agriculture, Forestry & Fishing', 'Manufacturing', 'Energy & Power', 'Transportation & Storage', 'Wholesale & Retail Trade', 'Construction & Real Estate', 'Tourism & Hospitality'];

export const BLANK: FormState = {
  loanId: '', typeOfCompany: 'Private', sector: SECTORS[0],
  borrowerName: '', borrowerType: 'Large Corporate', borrowerRegNo: '',
  city: '', country: 'Kenya', loanAmount: '', loanTenure: '',
  loanStartDate: '', loanEndDate: '', totalEquity: '', totalDebt: '',
  activityPeriod: '', outstandingAmount: '', dataQuality: '',
  scope1Emissions: '', scope2Emissions: '', scope3Emissions: '',
  companyRevenue: '', companyEbit: '', sectorEmissionIntensity: '',
  sectorAverageIntensity: '',
};

export function getBusinessLoanEmissionsFromForm(form: FormState): number {
  const outstanding = Number(form.outstandingAmount || 0);
  const totalEquity = Number(form.totalEquity || 0);
  const totalDebt = Number(form.totalDebt || 0);

  if (form.dataQuality === '1a' || form.dataQuality === '1b') {
    const s1 = Number(form.scope1Emissions || 0);
    const s2 = Number(form.scope2Emissions || 0);
    const s3 = Number(form.scope3Emissions || 0);
    return calculateBusinessLoanEmissionsOption1(outstanding, totalEquity, totalDebt, s1 + s2 + s3);
  } else if (form.dataQuality === '2a') {
    const revenue = Number(form.companyRevenue || 0);
    const factor = Number(form.sectorEmissionIntensity || 0);
    return calculateBusinessLoanEmissionsOption2(outstanding, totalEquity, totalDebt, revenue, factor);
  } else if (form.dataQuality === '2b') {
    const ebit = Number(form.companyEbit || 0);
    const factor = Number(form.sectorEmissionIntensity || 0);
    return calculateBusinessLoanEmissionsOption2(outstanding, totalEquity, totalDebt, ebit, factor);
  } else if (form.dataQuality === '3a') {
    const factor = Number(form.sectorAverageIntensity || 0);
    return calculateBusinessLoanEmissionsOption3(outstanding, factor);
  }
  return 0;
}

export function useBusinessLoanCapture() {
  const [tab, setTab] = useState<TabKey>('Pending');
  const [records, setRecords] = useState<BusinessLoanCapture[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [auditLoanId, setAuditLoanId] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<BusinessLoanCapture | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [form, setForm] = useState<FormState>(BLANK);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecords = () => {
    setIsLoading(true);
    apiJson<BusinessLoanCapture[]>('/data-capture')
      .then(data => {
        setRecords(data.filter(r => r.assetClass === 'Business Loans'));
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

  const setF = (k: keyof FormState) => (v: string) => setForm(p => ({ ...p, [k]: v }));
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
    const matchSearch = !search ||
      r.loanId.toLowerCase().includes(search.toLowerCase()) ||
      r.borrowerName.toLowerCase().includes(search.toLowerCase());
    const matchDate = tab === 'Approved'
      ? (!dateFrom || r.activityPeriod >= dateFrom) && (!dateTo || r.activityPeriod <= dateTo)
      : true;
    return matchTab && matchSearch && matchDate;
  });

  function openEdit(rec: BusinessLoanCapture) {
    setEditRecord(rec);
    setForm({
      loanId:                 rec.loanId,
      typeOfCompany:          rec.typeOfCompany || 'Private',
      sector:                 rec.sector,
      borrowerName:           rec.borrowerName,
      borrowerType:           rec.borrowerType  || 'Large Corporate',
      borrowerRegNo:          rec.borrowerRegNo || '',
      city:                   rec.city          || '',
      country:                rec.country       || 'Kenya',
      loanAmount:             String(rec.loanAmount  || 0),
      loanTenure:             String(rec.loanTenure  || 0),
      loanStartDate:          rec.loanStartDate  || '',
      loanEndDate:            rec.loanEndDate    || '',
      totalEquity:            String(rec.totalEquity || 0),
      totalDebt:              String(rec.totalDebt   || 0),
      activityPeriod:         rec.activityPeriod,
      outstandingAmount:      String(rec.outstandingAmount || 0),
      dataQuality:            rec.dataQuality ?? '',
      // Emissions fields — use stored values or empty string (never demo hardcodes)
      scope1Emissions:        String(rec.scope1Emissions        ?? ''),
      scope2Emissions:        String(rec.scope2Emissions        ?? ''),
      scope3Emissions:        String(rec.scope3Emissions        ?? ''),
      companyRevenue:         String(rec.companyRevenue         ?? ''),
      companyEbit:            String(rec.companyEbit            ?? ''),
      sectorEmissionIntensity:String(rec.sectorEmissionIntensity ?? ''),
      sectorAverageIntensity: String(rec.sectorAverageIntensity  ?? ''),
    });
    setModalOpen(true);
  }

  function handleSaveDraft() {
    if (!editRecord) return;
    const emissions = getBusinessLoanEmissionsFromForm(form);
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
    const emissions = getBusinessLoanEmissionsFromForm(form);
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
    isLoading,
  };
}
