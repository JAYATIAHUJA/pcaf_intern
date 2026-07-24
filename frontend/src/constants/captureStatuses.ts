
export const CAPTURE_STATUS = {
  PENDING_FOR_CAPTURE: 'Pending for Capture',
  SUBMITTED_PENDING:   'Submitted & Pending',
  APPROVED:            'Approved',
  REJECTED:            'Rejected',
} as const;

export type CaptureStatusValue = (typeof CAPTURE_STATUS)[keyof typeof CAPTURE_STATUS];

export type TabKey = 'Pending' | 'Draft' | 'Rejected' | 'Approved';
