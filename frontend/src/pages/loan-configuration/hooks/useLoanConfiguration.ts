import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiJson, apiRequest } from '../../../lib/api';

export type LoanTab = 'Master Table' | 'Business Loans' | 'Commercial Real Estate' | 'Motor Vehicle' | 'Mortgage';
export const TABS: LoanTab[] = ['Master Table', 'Business Loans', 'Commercial Real Estate', 'Motor Vehicle', 'Mortgage'];
export const SECTORS = [
  'Agriculture, Forestry & Fishing', 
  'Manufacturing', 
  'Energy & Power', 
  'Transportation & Storage', 
  'Wholesale & Retail Trade', 
  'Construction & Real Estate', 
  'Tourism & Hospitality', 
  'Information Technology'
];

export function useLoanConfiguration() {
  const [tab, setTab] = useState<LoanTab>('Master Table');
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [blForm, setBlForm] = useState({
    loanId: '', 
    typeOfCompany: 'Private', 
    sector: SECTORS[0],
    borrowerName: '', 
    borrowerType: 'Large Corporate', 
    borrowerRegNo: '',
    city: '', 
    country: 'Kenya', 
    loanAmount: '', 
    loanTenure: '',
    loanStartDate: '', 
    loanEndDate: '', 
    remarks: '',
  });

  const fetchConfigs = () => {
    setLoading(true);
    apiJson<any[]>('/loan-configurations')
      .then(data => {
        setConfigs(data);
      })
      .catch(err => {
        console.error(err);
        toast.error(err.message || 'Failed to fetch loan configurations');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  function openEdit(id: string) {
    const rec = configs.find(r => r.loanId === id);
    if (!rec) return;
    setEditId(id);
    setBlForm({
      loanId: rec.loanId, 
      typeOfCompany: rec.typeOfCompany || 'Private', 
      sector: rec.sector || '',
      borrowerName: rec.borrowerName || '', 
      borrowerType: rec.borrowerType || '', 
      borrowerRegNo: rec.borrowerRegNo || '',
      city: rec.city || '', 
      country: rec.country || '',
      loanAmount: String(rec.loanAmount || ''), 
      loanTenure: String(rec.loanTenure || ''),
      loanStartDate: rec.loanStartDate || '', 
      loanEndDate: rec.loanEndDate || '', 
      remarks: rec.remarks || '',
    });
    setModalOpen(true);
  }

  function openAdd() {
    setEditId(null);
    setBlForm({ 
      loanId: '', 
      typeOfCompany: 'Private', 
      sector: SECTORS[0], 
      borrowerName: '', 
      borrowerType: 'Large Corporate', 
      borrowerRegNo: '', 
      city: '', 
      country: 'Kenya', 
      loanAmount: '', 
      loanTenure: '', 
      loanStartDate: '', 
      loanEndDate: '', 
      remarks: '' 
    });
    setModalOpen(true);
  }

  function handleSubmit() {
    const payload = {
      loanId: blForm.loanId,
      assetClass: 'Business Loans',
      typeOfCompany: blForm.typeOfCompany,
      sector: blForm.sector,
      borrowerName: blForm.borrowerName,
      borrowerType: blForm.borrowerType,
      borrowerRegNo: blForm.borrowerRegNo,
      city: blForm.city,
      country: blForm.country,
      loanAmount: Number(blForm.loanAmount),
      loanTenure: Number(blForm.loanTenure),
      loanStartDate: blForm.loanStartDate,
      loanEndDate: blForm.loanEndDate,
      loanStatus: 'Active',
      remarks: blForm.remarks
    };

    if (editId) {
      apiRequest(`/loan-configurations/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to update configuration');
          toast.success('Loan configuration updated');
          setModalOpen(false);
          fetchConfigs();
        })
        .catch(err => {
          toast.error(err.message || 'Error updating configuration');
        });
    } else {
      apiRequest('/loan-configurations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(data => {
              throw new Error(data.error || 'Failed to add configuration');
            });
          }
          toast.success('New loan configuration added');
          setModalOpen(false);
          fetchConfigs();
        })
        .catch(err => {
          toast.error(err.message || 'Error adding configuration');
        });
    }
  }

  function handleDelete(loanId: string) {
    if (!window.confirm(`Are you sure you want to delete configuration for loan "${loanId}"?`)) return;
    apiRequest(`/loan-configurations/${loanId}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete configuration');
        toast.success('Loan configuration deleted');
        fetchConfigs();
      })
      .catch(err => {
        toast.error(err.message || 'Error deleting configuration');
      });
  }

  const matchesSearch = (r: any) => !search || String(r.borrowerName || '').toLowerCase().includes(search.toLowerCase()) || String(r.loanId || '').toLowerCase().includes(search.toLowerCase()) || String(r.assetClass || '').toLowerCase().includes(search.toLowerCase());

  const filteredMaster = configs.filter(matchesSearch);

  const filteredBL = configs
    .filter(c => c.assetClass === 'Business Loans')
    .filter(matchesSearch);

  const filteredCRE = configs
    .filter(c => c.assetClass === 'Commercial Real Estate')
    .filter(matchesSearch);

  const filteredMV = configs
    .filter(c => c.assetClass === 'Motor Vehicle')
    .filter(matchesSearch);

  const filteredMG = configs
    .filter(c => c.assetClass === 'Mortgage')
    .filter(matchesSearch);

  return {
    tab,
    setTab,
    modalOpen,
    setModalOpen,
    importModalOpen,
    setImportModalOpen,
    editId,
    search,
    setSearch,
    configs,
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
  };
}

