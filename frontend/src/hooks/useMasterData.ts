import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiJson, apiRequest } from '../lib/api';
import { DEFAULT_MASTER_DATA, type MasterDataMap, type MasterDataOption } from '../constants/masterData';

export function useMasterData() {
  const [masterData, setMasterData] = useState<MasterDataMap>(DEFAULT_MASTER_DATA);
  const [loading, setLoading] = useState(true);

  const fetchMasterData = () => {
    setLoading(true);
    apiJson<MasterDataMap>('/master-data')
      .then(data => setMasterData({ ...DEFAULT_MASTER_DATA, ...data }))
      .catch(err => {
        console.error('Failed to load master data', err);
        toast.error('Using fallback dropdown values. Master data API unavailable.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  const createOption = async (option: Pick<MasterDataOption, 'category' | 'value' | 'label' | 'sortOrder'>) => {
    const res = await apiRequest('/master-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(option)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to add master data option');
    fetchMasterData();
  };

  const updateOption = async (id: number, option: Partial<MasterDataOption>) => {
    const res = await apiRequest(`/master-data/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(option)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to update master data option');
    fetchMasterData();
  };

  const deactivateOption = async (id: number) => {
    const res = await apiRequest(`/master-data/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to deactivate master data option');
    fetchMasterData();
  };

  return { masterData, loading, refresh: fetchMasterData, createOption, updateOption, deactivateOption };
}
