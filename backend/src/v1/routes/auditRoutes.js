import { API_ROUTES } from '../constants.js';
import express from 'express';
import { authenticateToken } from '../../middleware/authMiddleware.js';
import * as auditService from '../services/auditService.js';

const router = express.Router();

router.get(API_ROUTES.AUDIT.GET, authenticateToken, async (req, res) => {
  try {
    const { loanId, entityType } = req.query;
    
    // Intelligently check permissions:
    // - Central audit dashboard (no loanId filter): requires 'Audit Trail' - 'view' permission.
    // - Record audit log history (loanId filter): requires 'Data Capture' - 'view' or 'Loan Configuration' - 'view' permission.
    if (!loanId) {
      const permissions = req.permissions['Audit Trail'] || [];
      if (!permissions.includes('view')) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions to view the central Audit Trail dashboard' });
      }
    } else {
      const capPerms = req.permissions['Data Capture'] || [];
      const configPerms = req.permissions['Loan Configuration'] || [];
      if (!capPerms.includes('view') && !configPerms.includes('view')) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions to view individual record audit history' });
      }
    }

    const list = await auditService.getAuditLogs({ loanId, entityType });
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

export default router;
