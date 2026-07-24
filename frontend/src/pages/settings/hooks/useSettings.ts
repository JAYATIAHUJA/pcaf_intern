import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiJson, apiRequest } from '../../../lib/api';
import { handleApiError } from '../../../lib/handleApiError';
import { API_PATHS } from '../../../constants/apiPaths';
import type {
  Integration,
  NotificationSettingsModel,
  OrganisationSettings,
  ReportingSettings,
  SettingsResponse,
} from '../../../types/settings';

const EMPTY_ORGANISATION: OrganisationSettings = { name: '', lei: '', country: '', pcafSignatorySince: '' };
const EMPTY_REPORTING: ReportingSettings = { fiscalYear: '', currency: '', emissionFactorSource: '', consolidationApproach: '' };
const EMPTY_NOTIFICATIONS: NotificationSettingsModel = {
  pendingApprovals: false,
  dataQualityDrops: false,
  emissionUpdates: false,
  monthlySummary: false
};

export function useSettings() {
  const [org, setOrg] = useState<OrganisationSettings>(EMPTY_ORGANISATION);
  const [rep, setRep] = useState<ReportingSettings>(EMPTY_REPORTING);
  const [notif, setNotif] = useState<NotificationSettingsModel>(EMPTY_NOTIFICATIONS);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = () => {
    apiJson<SettingsResponse>(API_PATHS.SETTINGS)
      .then(data => {
        if (data.organisation) setOrg(data.organisation);
        if (data.reporting)    setRep(data.reporting);
        if (data.notifications) setNotif(data.notifications);
        setError(null);
      })
      .catch(err => {
        handleApiError(err, 'Failed to fetch settings', true); // silent — error shown via error state
        setError((err instanceof Error ? err.message : null) || 'Failed to fetch settings');
      });
  };

  const fetchIntegrations = () => {
    apiJson<Integration[]>(API_PATHS.SETTINGS_INTEGRATIONS())
      .then(data => setIntegrations(data))
      .catch(err => handleApiError(err, 'Failed to load integrations', true));
  };

  useEffect(() => {
    fetchSettings();
    fetchIntegrations();
  }, []);

  const saveOrg = () => {
    saveSettings(API_PATHS.SETTINGS_ORG, org, 'Organisation profile saved', 'Failed to save organisation profile', fetchSettings);
  };

  const saveRep = () => {
    saveSettings(API_PATHS.SETTINGS_REPORTING, rep, 'Reporting settings saved', 'Failed to save reporting settings', fetchSettings);
  };

  const saveNotif = () => {
    saveSettings(API_PATHS.SETTINGS_NOTIF, notif, 'Notification settings saved', 'Failed to save notification settings', fetchSettings);
  };

  const connectIntegration = (id: number) => {
    apiRequest(API_PATHS.SETTINGS_INTEGRATIONS(id), { method: 'POST' })
      .then(response => {
        if (!response.ok) throw new Error('Failed to connect integration');
        toast.success('Integration connected');
        fetchIntegrations();
      })
      .catch(err => handleApiError(err, 'Network error. Is the server running?'));
  };

  return {
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
  };
}

function saveSettings<T>(path: string, body: T, successMessage: string, errorMessage: string, onSuccess: () => void) {
  apiRequest(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(response => {
      if (!response.ok) throw new Error(errorMessage);
      toast.success(successMessage);
      onSuccess();
    })
    .catch((err) => toast.error(err.message || 'Network error. Is the server running?'));
}