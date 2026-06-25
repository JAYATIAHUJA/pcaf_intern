export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',

  // Data Capture — one page per asset class, with Pending/Rejected/Approved tabs
  DATA_CAPTURE_BUSINESS_LOANS: '/capture/business-loans',
  DATA_CAPTURE_MOTOR_VEHICLE: '/capture/motor-vehicle',
  DATA_CAPTURE_COMMERCIAL_RE: '/capture/commercial-real-estate',
  DATA_CAPTURE_MORTGAGE: '/capture/mortgage',

  // Loan Configuration — one page, 4 tabs
  LOAN_CONFIGURATION: '/loan-configuration',

  SETTINGS: '/settings',
  ROLE_MANAGEMENT: '/role-management',
  USER_MANAGEMENT: '/user-management',
} as const;

export const PAGE_TITLES: Record<string, string> = {
  [ROUTES.LOGIN]: 'Sign In',
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.DATA_CAPTURE_BUSINESS_LOANS]: 'Business Loan',
  [ROUTES.DATA_CAPTURE_MOTOR_VEHICLE]: 'Motor Vehicle Loans',
  [ROUTES.DATA_CAPTURE_COMMERCIAL_RE]: 'Commercial Real Estate Loans',
  [ROUTES.DATA_CAPTURE_MORTGAGE]: 'Mortgage Loans',
  [ROUTES.LOAN_CONFIGURATION]: 'Loan Configuration',
  [ROUTES.SETTINGS]: 'Settings',
  [ROUTES.ROLE_MANAGEMENT]: 'Role Management',
  [ROUTES.USER_MANAGEMENT]: 'User Management',
};
