import { API_ROUTES } from '../constants.js';
import express from 'express';
import { getConfigs, createConfig, importConfigs, updateConfig, deleteConfig } from '../controllers/loanConfigController.js';
import { authenticateToken, requirePermission } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get(API_ROUTES.LOAN_CONFIG.GET_ALL, authenticateToken, requirePermission('Loan Configuration', 'view'), getConfigs);
router.post(API_ROUTES.LOAN_CONFIG.CREATE, authenticateToken, requirePermission('Loan Configuration', 'create'), createConfig);
router.post(API_ROUTES.LOAN_CONFIG.IMPORT, authenticateToken, requirePermission('Loan Configuration', 'create'), importConfigs);
router.put(API_ROUTES.LOAN_CONFIG.UPDATE, authenticateToken, requirePermission('Loan Configuration', 'edit'), updateConfig);
router.delete(API_ROUTES.LOAN_CONFIG.DELETE, authenticateToken, requirePermission('Loan Configuration', 'delete'), deleteConfig);

export default router;
