import type { Dispatch, SetStateAction } from 'react';
import { IconBell } from '@tabler/icons-react';
import { SettingsSectionCard } from '../../../components/ui/SettingsSectionCard';
import { Toggle } from '../../../components/ui/Toggle';
import type { NotificationSettingsModel } from '../../../types/settings';

interface NotificationSettingsProps {
  notif: NotificationSettingsModel;
  setNotif: Dispatch<SetStateAction<NotificationSettingsModel>>;
  saveNotif: () => void;
}

const NOTIFICATION_ITEMS: Array<{ key: keyof NotificationSettingsModel; label: string; sub: string }> = [
  { key: 'pendingApprovals', label: 'Email digest on pending approvals', sub: 'Daily summary of records awaiting action' },
  { key: 'dataQualityDrops', label: 'Alert when data quality drops below DQ 3', sub: 'Immediate email on threshold breach' },
  { key: 'emissionUpdates', label: 'Notify on emission factor updates', sub: 'When IEA / GHG Protocol releases new factors' },
  { key: 'monthlySummary', label: 'Monthly coverage summary email', sub: 'Portfolio-wide report first Monday of month' },
];

export function NotificationSettings({ notif, setNotif, saveNotif }: NotificationSettingsProps) {
  return (
    <SettingsSectionCard title="Notification Settings" icon={<IconBell size={16} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {NOTIFICATION_ITEMS.map(item => (
          <div key={item.label} className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-slate-700">{item.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{item.sub}</div>
            </div>
            <Toggle
              checked={notif[item.key]}
              onChange={() => setNotif(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
            />
          </div>
        ))}
        <button onClick={saveNotif} className="btn btn-primary" style={{ alignSelf: "start", marginTop: 8 }}>
          Save
        </button>
      </div>
    </SettingsSectionCard>
  );
}