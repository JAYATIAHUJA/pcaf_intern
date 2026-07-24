export interface OrganisationSettings {
  name: string;
  lei: string;
  country: string;
  pcafSignatorySince: string;
}

export interface ReportingSettings {
  fiscalYear: string;
  currency: string;
  emissionFactorSource: string;
  consolidationApproach: string;
}

export interface NotificationSettingsModel {
  pendingApprovals: boolean;
  dataQualityDrops: boolean;
  emissionUpdates: boolean;
  monthlySummary: boolean;
}

export interface Integration {
  id: number;
  name: string;
  status: string;
}

export interface SettingsResponse {
  organisation?: OrganisationSettings;
  reporting?: ReportingSettings;
  notifications?: NotificationSettingsModel;
}