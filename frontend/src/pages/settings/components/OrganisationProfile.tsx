import type { Dispatch, SetStateAction } from 'react';
import { IconBuilding } from '@tabler/icons-react';
import { SettingsSectionCard } from '../../../components/ui';
import { Input, Select } from '../../../components/form';
import type { OrganisationSettings } from '../../../types/settings';

interface OrganisationProfileProps {
  org: OrganisationSettings;
  setOrg: Dispatch<SetStateAction<OrganisationSettings>>;
  saveOrg: () => void;
}

export function OrganisationProfile({ org, setOrg, saveOrg }: OrganisationProfileProps) {
  return (
    <SettingsSectionCard title="Organisation Profile" icon={<IconBuilding size={16} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input
          label="Institution Name"
          value={org.name}
          onChange={value => setOrg(prev => ({ ...prev, name: value }))}
        />
        <Input
          label="LEI (Legal Entity Identifier)"
          value={org.lei}
          onChange={value => setOrg(prev => ({ ...prev, lei: value }))}
        />
        <Select
          label="Headquarters Country"
          value={org.country}
          onChange={value => setOrg(prev => ({ ...prev, country: value }))}
          options={['India', 'Kenya', 'Germany', 'United States', 'United Kingdom']}
        />
        <Input
          label="PCAF Signatory Since"
          value={org.pcafSignatorySince}
          onChange={value => setOrg(prev => ({ ...prev, pcafSignatorySince: value }))}
        />
        <button onClick={saveOrg} className="btn btn-primary" style={{ alignSelf: "start" }}>
          Save Changes
        </button>
      </div>
    </SettingsSectionCard>
  );
}