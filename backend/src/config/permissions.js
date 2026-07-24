import { API_ROUTES } from '../v1/constants.js';

export const ROUTE_PERMISSIONS = {
  // Dashboard
  [`GET ${API_ROUTES.DASHBOARD.BASE}${API_ROUTES.DASHBOARD.GET}`.replace(/\/+$/, '')]: { module: 'Dashboard', action: 'view' },

  // Data Capture
  [`GET ${API_ROUTES.DATA_CAPTURE.BASE}${API_ROUTES.DATA_CAPTURE.GET_ALL}`.replace(/\/+$/, '')]: { module: 'Data Capture', action: 'view' },
  [`PUT ${API_ROUTES.DATA_CAPTURE.BASE}${API_ROUTES.DATA_CAPTURE.UPDATE}`]: { module: 'Data Capture', action: 'edit' },
  [`POST ${API_ROUTES.DATA_CAPTURE.BASE}${API_ROUTES.DATA_CAPTURE.APPROVE}`]: { module: 'Data Capture', action: 'approve' },
  [`POST ${API_ROUTES.DATA_CAPTURE.BASE}${API_ROUTES.DATA_CAPTURE.REJECT}`]: { module: 'Data Capture', action: 'approve' },

  // Loan Configurations
  [`GET ${API_ROUTES.LOAN_CONFIG.BASE}${API_ROUTES.LOAN_CONFIG.GET_ALL}`.replace(/\/+$/, '')]: { module: 'Loan Configuration', action: 'view' },
  [`POST ${API_ROUTES.LOAN_CONFIG.BASE}${API_ROUTES.LOAN_CONFIG.CREATE}`.replace(/\/+$/, '')]: { module: 'Loan Configuration', action: 'create' },
  [`POST ${API_ROUTES.LOAN_CONFIG.BASE}${API_ROUTES.LOAN_CONFIG.IMPORT}`]: { module: 'Loan Configuration', action: 'create' },
  [`PUT ${API_ROUTES.LOAN_CONFIG.BASE}${API_ROUTES.LOAN_CONFIG.UPDATE}`]: { module: 'Loan Configuration', action: 'edit' },
  [`DELETE ${API_ROUTES.LOAN_CONFIG.BASE}${API_ROUTES.LOAN_CONFIG.DELETE}`]: { module: 'Loan Configuration', action: 'delete' },

  // User Management
  [`GET ${API_ROUTES.USERS.BASE}${API_ROUTES.USERS.GET_ALL}`.replace(/\/+$/, '')]: { module: 'User Management', action: 'view' },
  [`POST ${API_ROUTES.USERS.BASE}${API_ROUTES.USERS.CREATE}`.replace(/\/+$/, '')]: { module: 'User Management', action: 'create' },
  [`PUT ${API_ROUTES.USERS.BASE}${API_ROUTES.USERS.UPDATE}`]: { module: 'User Management', action: 'edit' },
  [`DELETE ${API_ROUTES.USERS.BASE}${API_ROUTES.USERS.DELETE}`]: { module: 'User Management', action: 'delete' },
  [`POST ${API_ROUTES.USERS.BASE}${API_ROUTES.USERS.ACTIVATE}`]: { module: 'User Management', action: 'edit' },
  [`POST ${API_ROUTES.USERS.BASE}${API_ROUTES.USERS.DEACTIVATE}`]: { module: 'User Management', action: 'edit' },
  [`POST ${API_ROUTES.USERS.BASE}${API_ROUTES.USERS.RESET_PASSWORD}`]: { module: 'User Management', action: 'edit' },

  // Role Management
  [`GET ${API_ROUTES.ROLES.BASE}${API_ROUTES.ROLES.GET_ALL}`.replace(/\/+$/, '')]: { module: 'Role Management', action: 'view' },
  [`POST ${API_ROUTES.ROLES.BASE}${API_ROUTES.ROLES.CREATE}`.replace(/\/+$/, '')]: { module: 'Role Management', action: 'create' },
  [`PUT ${API_ROUTES.ROLES.BASE}${API_ROUTES.ROLES.UPDATE}`]: { module: 'Role Management', action: 'edit' },
  [`DELETE ${API_ROUTES.ROLES.BASE}${API_ROUTES.ROLES.DELETE}`]: { module: 'Role Management', action: 'delete' },
  [`GET ${API_ROUTES.ROLES.BASE}${API_ROUTES.ROLES.GET_PERMISSIONS}`]: { module: 'Role Management', action: 'view' },
  [`PUT ${API_ROUTES.ROLES.BASE}${API_ROUTES.ROLES.UPDATE_PERMISSIONS}`]: { module: 'Role Management', action: 'edit' },

  // Settings
  [`GET ${API_ROUTES.SETTINGS.BASE}${API_ROUTES.SETTINGS.GET}`.replace(/\/+$/, '')]: { module: 'Settings', action: 'view' },
  [`PUT ${API_ROUTES.SETTINGS.BASE}${API_ROUTES.SETTINGS.UPDATE_ORG}`]: { module: 'Settings', action: 'edit' },
  [`PUT ${API_ROUTES.SETTINGS.BASE}${API_ROUTES.SETTINGS.UPDATE_REP}`]: { module: 'Settings', action: 'edit' },
  [`PUT ${API_ROUTES.SETTINGS.BASE}${API_ROUTES.SETTINGS.UPDATE_NOTIF}`]: { module: 'Settings', action: 'edit' },
  [`GET ${API_ROUTES.SETTINGS.BASE}${API_ROUTES.SETTINGS.GET_INTEGRATIONS}`]: { module: 'Settings', action: 'view' },
  [`POST ${API_ROUTES.SETTINGS.BASE}${API_ROUTES.SETTINGS.CONNECT_INTEGRATION}`]: { module: 'Settings', action: 'edit' },

  // Audit Trail
  [`GET ${API_ROUTES.AUDIT.BASE}${API_ROUTES.AUDIT.GET}`.replace(/\/+$/, '')]: { module: 'Audit Trail', action: 'view' }
};
