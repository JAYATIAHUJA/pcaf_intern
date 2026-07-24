import type { Dispatch, SetStateAction } from 'react';
import { IconSettings2 } from '@tabler/icons-react';
import { SettingsSectionCard } from '../../../components/ui';
import { Select } from '../../../components/form';
import type { ReportingSettings } from '../../../types/settings';

interface ReportingConfigProps {
  rep: ReportingSettings;
  setRep: Dispatch<SetStateAction<ReportingSettings>>;
  saveRep: () => void;
}

export function ReportingConfig({ rep, setRep, saveRep }: ReportingConfigProps) {
  return (
    <SettingsSectionCard title="Reporting Configuration" icon={<IconSettings2 size={16} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Select
          label="Fiscal Year"
          value={rep.fiscalYear}
          onChange={value => setRep(prev => ({ ...prev, fiscalYear: value }))}
          options={['January - December (Calendar Year)', 'April - March']}
        />
        <Select
          label="Reporting Currency"
          value={rep.currency}
          onChange={value => setRep(prev => ({ ...prev, currency: value }))}
          options={['USD - US Dollar', 'INR - Indian Rupee', 'EUR - Euro', 'KES - Kenyan Shilling']}
        />
        <Select
          label="Default Emission Factor Source"
          value={rep.emissionFactorSource}
          onChange={value => setRep(prev => ({ ...prev, emissionFactorSource: value }))}
          options={['IEA World Energy Statistics 2024', 'GHG Protocol', 'IPCC AR6']}
        />
        <Select
          label="Consolidation Approach"
          value={rep.consolidationApproach}
          onChange={value => setRep(prev => ({ ...prev, consolidationApproach: value }))}
          options={['Operational Control', 'Financial Control', 'Equity Share']}
        />
        <button onClick={saveRep} className="btn btn-primary" style={{ alignSelf: "start" }}>
          Save Changes
        </button>
      </div>
    </SettingsSectionCard>
  );
}