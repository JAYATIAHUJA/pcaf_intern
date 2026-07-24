export const API_PATHS = {
  DASHBOARD:            '/dashboard',
  DATA_CAPTURE:         '/data-capture',
  DATA_CAPTURE_APPROVE: '/data-capture/approve',
  DATA_CAPTURE_REJECT:  '/data-capture/reject',
  DATA_CAPTURE_BY_ID:   (id: string | number) => `/data-capture/${id}`,

  SETTINGS:             '/settings',
  SETTINGS_ORG:         '/settings/organisation',
  SETTINGS_REPORTING:   '/settings/reporting',
  SETTINGS_NOTIF:       '/settings/notifications',
  SETTINGS_INTEGRATIONS:(id?: number) =>
    id !== undefined
      ? `/settings/integrations/${id}/connect`
      : '/settings/integrations',
} as const;
