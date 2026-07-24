import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiJson, apiRequest } from '../../../../lib/api';
import type { DQOption } from '../../../../types';

export type TabKey = 'Pending' | 'Draft' | 'Rejected' | 'Approved';

export interface CREFormState {
  loanId: string; propertyId: string; country: string;
  borrowerName: string; borrowerType: string; borrowerRegNo: string;
  sector: string; yearBuilt: string; totalFloors: string;
  propertyValue: string; floorAreaFinanced: string;
  propertyCategory: string; propertyType: string; propertyLocation: string;
  loanAmount: string; loanTenure: string; loanStartDate: string; loanEndDate: string;
  activityPeriod: string; outstandingAmount: string;
  dataQuality: DQOption | '';
  actualEnergy: string; avgEmissionFactor: string;
}

const BLANK: CREFormState = {
  loanId: '', propertyId: '', country: 'Kenya',
  borrowerName: '', borrowerType: 'Large Corporate', borrowerRegNo: '',
  sector: '', yearBuilt: '', totalFloors: '',
  propertyValue: '', floorAreaFinanced: '',
  propertyCategory: 'Commercial', propertyType: 'Mixed-Use Building', propertyLocation: '',
  loanAmount: '', loanTenure: '', loanStartDate: '', loanEndDate: '',
  activityPeriod: '', outstandingAmount: '', dataQuality: '',
  actualEnergy: '', avgEmissionFactor: '',
};

export function useCommercialRECapture() {
  const [tab, setTab] = useState<TabKey>('Pending');
  const [records, setRecords] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [auditLoanId, setAuditLoanId] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<any | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [form, setForm] = useState<CREFormState>(BLANK);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecords = () => {
    setIsLoading(true);
    apiJson<any[]>('/data-capture')
      .then(data => setRecords(data.filter(r => r.assetClass === 'Commercial Real Estate')))
      .catch(err => toast.error(err.message || 'Failed to fetch capture records'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchRecords(); }, []);

  const setF = (k: keyof CREFormState) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const totalEmissions = records.reduce((s, r) => s + r.financedEmissions, 0);

  const counts: Record<TabKey, number> = {
    Pending: records.filter(r => r.status === 'Pending for Capture' || r.status === 'Submitted & Pending').length,
    Draft: records.filter(r => r.status === 'Pending for Capture').length,
    Rejected: records.filter(r => r.status === 'Rejected').length,
    Approved: records.filter(r => r.status === 'Approved').length,
  };

  const shown = records.filter(r => {
    const matchTab =
      tab === 'Approved' ? r.status === 'Approved' :
      tab === 'Draft'    ? r.status === 'Pending for Capture' :
      tab === 'Rejected' ? r.status === 'Rejected' :
                           (r.status === 'Pending for Capture' || r.status === 'Submitted & Pending');
    const matchSearch = !search || r.loanId.toLowerCase().includes(search.toLowerCase()) || r.borrowerName.toLowerCase().includes(search.toLowerCase());
    const matchDate = tab === 'Approved'
      ? (!dateFrom || r.activityPeriod >= dateFrom) && (!dateTo || r.activityPeriod <= dateTo)
      : true;
    return matchTab && matchSearch && matchDate;
  });

  function openEdit(rec: any) {
    setEditRecord(rec);
    setForm({
      loanId: rec.loanId, propertyId: rec.propertyId || '', country: rec.country || 'Kenya',
      borrowerName: rec.borrowerName, borrowerType: rec.borrowerType || 'Large Corporate', borrowerRegNo: rec.borrowerRegNo || '',
      sector: rec.sector || '', yearBuilt: String(rec.yearBuilt || ''), totalFloors: String(rec.totalFloors || ''),
      propertyValue: String(rec.propertyValue || 0), floorAreaFinanced: String(rec.floorAreaFinanced || 0),
      propertyCategory: rec.propertyCategory || 'Commercial', propertyType: rec.propertyType || '', propertyLocation: rec.propertyLocation || '',
      loanAmount: String(rec.loanAmount || 0), loanTenure: String(rec.loanTenure || ''), loanStartDate: rec.loanStartDate || '', loanEndDate: rec.loanEndDate || '',
      activityPeriod: rec.activityPeriod, outstandingAmount: String(rec.outstandingAmount || 0),
      dataQuality: rec.dataQuality ?? '',
      actualEnergy: String(rec.actualEnergy || ''), avgEmissionFactor: String(rec.avgEmissionFactor || ''),
    });
    setModalOpen(true);
  }

  function handleSaveDraft() {
    if (!editRecord) return;
    setIsLoading(true);
    apiRequest(`/data-capture/${editRecord.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, financedEmissions: 0, status: 'Pending for Capture' })
    })
      .then(res => { if (!res.ok) throw new Error('Failed to save draft'); toast('Record saved as draft', { icon: 'Edit' }); fetchRecords(); })
      .catch(err => toast.error(err.message))
      .finally(() => { setIsLoading(false); setModalOpen(false); });
  }

  function handleSubmit() {
    if (!form.dataQuality) { toast.error('Please select a Data Quality score'); return; }
    if (!editRecord) return;
    const actualE = Number(form.actualEnergy || 0);
    const ef = Number(form.avgEmissionFactor || 0);
    const outstanding = Number(form.outstandingAmount || 0);
    const propValue = Number(form.propertyValue || 1);
    const emissions = (outstanding / propValue) * actualE * ef;
    setIsLoading(true);
    apiRequest(`/data-capture/${editRecord.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, financedEmissions: emissions, status: 'Submitted & Pending' })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to submit record');
        toast.success(`Record ${form.loanId} submitted successfully`);
        fetchRecords();
      })
      .catch(err => toast.error(err.message))
      .finally(() => { setIsLoading(false); setModalOpen(false); });
  }

  function handleApprove() {
    if (!selected.length) return;
    setIsLoading(true);
    apiRequest('/data-capture/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: selected }) })
      .then(res => {
        if (!res.ok) throw new Error('Failed to approve records');
        toast.success(`${selected.length} record(s) approved`);
        setSelected([]);
        fetchRecords();
      })
      .catch(err => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }

  function handleReject() {
    if (!selected.length) { toast.error('Select at least one record to reject'); return; }
    setIsLoading(true);
    apiRequest('/data-capture/reject', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: selected }) })
      .then(res => {
        if (!res.ok) throw new Error('Failed to reject records');
        toast.error(`${selected.length} record(s) rejected`);
        setSelected([]);
        fetchRecords();
      })
      .catch(err => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }

  const allSelected = shown.length > 0 && shown.every(r => selected.includes(String(r.id)));
  const toggleAll = () => setSelected(allSelected ? [] : shown.map(r => String(r.id)));

  return { tab, setTab, records, modalOpen, setModalOpen, auditLoanId, setAuditLoanId, editRecord, selected, setSelected, search, setSearch, dateFrom, setDateFrom, dateTo, setDateTo, form, setF, totalEmissions, counts, shown, openEdit, handleSaveDraft, handleSubmit, handleApprove, handleReject, allSelected, toggleAll, isLoading };
}
