import React from 'react';
import { useSettings } from './hooks/useSettings';
import { OrganisationProfile } from './components/OrganisationProfile';
import { ReportingConfig } from './components/ReportingConfig';
import { NotificationSettings } from './components/NotificationSettings';
import { IntegrationsList } from './components/IntegrationsList';
import { MasterDataManager } from './components/MasterDataManager';
import { useMasterData } from '../../hooks/useMasterData';

export default function Settings() {
  const { masterData, createOption, updateOption, deactivateOption } = useMasterData();
  const {
    org,
    setOrg,
    rep,
    setRep,
    notif,
    setNotif,
    integrations,
    saveOrg,
    saveRep,
    saveNotif,
    connectIntegration,
    error
  } = useSettings();

  if (error && (error.includes('Forbidden') || error.includes('Unauthorized') || error.includes('permission') || error.includes('403') || error.includes('401'))) {
    return (
      <div style={{ padding: 24, background: '#f1f5f9', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32, maxWidth: 480, textAlign: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>!</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Access Denied</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            You do not have permission to view or manage settings on this platform. Please contact a Super Admin if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: '#f1f5f9', minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Settings</h2>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>
          Configure organisation profile, PCAF reporting parameters, and dropdown master data
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <OrganisationProfile org={org} setOrg={setOrg} saveOrg={saveOrg} />
        <ReportingConfig rep={rep} setRep={setRep} saveRep={saveRep} />
        <NotificationSettings notif={notif} setNotif={setNotif} saveNotif={saveNotif} />
        <IntegrationsList integrations={integrations} connectIntegration={connectIntegration} />
        <div style={{ gridColumn: '1 / -1' }}>
          <MasterDataManager
            masterData={masterData}
            createOption={createOption}
            updateOption={updateOption}
            deactivateOption={deactivateOption}
          />
        </div>
      </div>
    </div>
  );
}
