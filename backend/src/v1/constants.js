export const API_ROUTES = {
  AUTH: {
    BASE: '/v1/auth',
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH: '/refresh',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    CHANGE_PASSWORD: '/change-password',
    ME: '/me'
  },
  DASHBOARD: {
    BASE: '/v1/dashboard',
    GET: '/'
  },
  DATA_CAPTURE: {
    BASE: '/v1/data-capture',
    GET_ALL: '/',
    UPDATE: '/:id',
    APPROVE: '/approve',
    REJECT: '/reject'
  },
  LOAN_CONFIG: {
    BASE: '/v1/loan-configurations',
    GET_ALL: '/',
    CREATE: '/',
    IMPORT: '/import',
    UPDATE: '/:loanId',
    DELETE: '/:loanId'
  },
  USERS: {
    BASE: '/v1/users',
    GET_ALL: '/',
    CREATE: '/',
    UPDATE: '/:id',
    DELETE: '/:id',
    ACTIVATE: '/:id/activate',
    DEACTIVATE: '/:id/deactivate',
    RESET_PASSWORD: '/:id/reset-password'
  },
  ROLES: {
    BASE: '/v1/roles',
    GET_ALL: '/',
    CREATE: '/',
    UPDATE: '/:id',
    DELETE: '/:id',
    GET_PERMISSIONS: '/:id/permissions',
    UPDATE_PERMISSIONS: '/:id/permissions'
  },
  SETTINGS: {
    BASE: '/v1/settings',
    GET: '/',
    UPDATE_ORG: '/organisation',
    UPDATE_REP: '/reporting',
    UPDATE_NOTIF: '/notifications',
    GET_INTEGRATIONS: '/integrations',
    CONNECT_INTEGRATION: '/integrations/:id/connect'
  },
  MASTER_DATA: {
    BASE: '/v1/master-data',
    GET_ALL: '/',
    CREATE: '/',
    UPDATE: '/:id',
    DELETE: '/:id'
  },
  AUDIT: {
    BASE: '/v1/audit-trail',
    GET: '/'
  }
};


