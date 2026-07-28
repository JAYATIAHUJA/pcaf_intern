import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { IconDatabase, IconPlus, IconPower, IconDeviceFloppy } from '@tabler/icons-react';
import { SettingsSectionCard } from '../../../components/ui';
import { MASTER_DATA_LABELS, type MasterDataMap, type MasterDataOption } from '../../../constants/masterData';

interface MasterDataManagerProps {
  masterData: MasterDataMap;
  createOption: (option: Pick<MasterDataOption, 'category' | 'value' | 'label' | 'sortOrder'>) => Promise<void>;
  updateOption: (id: number, option: Partial<MasterDataOption>) => Promise<void>;
  deactivateOption: (id: number) => Promise<void>;
}

const categories = Object.keys(MASTER_DATA_LABELS);

export function MasterDataManager({ masterData, createOption, updateOption, deactivateOption }: MasterDataManagerProps) {
  const [category, setCategory] = useState(categories[0]);
  const [newValue, setNewValue] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);

  const rows = useMemo(() => masterData[category] || [], [masterData, category]);

  const addOption = async () => {
    const value = newValue.trim();
    const label = (newLabel || newValue).trim();
    if (!value) {
      toast.error('Value is required');
      return;
    }
    try {
      await createOption({ category, value, label, sortOrder: rows.length + 1 });
      setNewValue('');
      setNewLabel('');
      toast.success('Master data option added');
    } catch (err) {
      toast.error((err as Error).message || 'Failed to add option');
    }
  };

  const saveRow = async (option: MasterDataOption) => {
    if (!option.id) return;
    setSavingId(option.id);
    try {
      await updateOption(option.id, option);
      toast.success('Master data option updated');
    } catch (err) {
      toast.error((err as Error).message || 'Failed to update option');
    } finally {
      setSavingId(null);
    }
  };

  const setLocalRow = (id: number | undefined, patch: Partial<MasterDataOption>) => {
    if (!id) return;
    const option = rows.find(item => item.id === id);
    if (!option) return;
    Object.assign(option, patch);
  };

  return (
    <SettingsSectionCard title="Master Data" icon={<IconDatabase size={16} />}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {categories.map(item => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={category === item ? 'tab-btn-active' : 'tab-btn'}
              style={{ textAlign: 'left', justifyContent: 'flex-start', borderRadius: 6 }}
            >
              {MASTER_DATA_LABELS[item]}
            </button>
          ))}
        </div>

        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 96px', gap: 8, marginBottom: 12 }}>
            <input className="field-input" placeholder="Value" value={newValue} onChange={e => setNewValue(e.target.value)} />
            <input className="field-input" placeholder="Label" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
            <button className="btn btn-primary btn-sm" onClick={addOption} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <IconPlus size={14} /> Add
            </button>
          </div>

          <div style={{ maxHeight: 360, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={th}>Value</th>
                  <th style={th}>Label</th>
                  <th style={th}>Order</th>
                  <th style={th}>Status</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(option => (
                  <tr key={`${option.category}-${option.id || option.value}`} style={{ borderTop: '1px solid #f1f5f9', opacity: option.isActive ? 1 : 0.58 }}>
                    <td style={td}><input className="field-input" defaultValue={option.value} onBlur={e => setLocalRow(option.id, { value: e.target.value })} /></td>
                    <td style={td}><input className="field-input" defaultValue={option.label} onBlur={e => setLocalRow(option.id, { label: e.target.value })} /></td>
                    <td style={td}><input className="field-input" type="number" defaultValue={option.sortOrder || 0} onBlur={e => setLocalRow(option.id, { sortOrder: Number(e.target.value) })} /></td>
                    <td style={td}>{option.isActive ? 'Active' : 'Inactive'}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                      <button className="btn-icon" title="Save" onClick={() => saveRow(option)} disabled={!option.id || savingId === option.id}><IconDeviceFloppy size={14} /></button>
                      {option.id && option.isActive && <button className="btn-icon" title="Deactivate" onClick={() => deactivateOption(option.id!)}><IconPower size={14} /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SettingsSectionCard>
  );
}

const th: React.CSSProperties = { padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: '#475569' };
const td: React.CSSProperties = { padding: '8px 10px', verticalAlign: 'middle' };
