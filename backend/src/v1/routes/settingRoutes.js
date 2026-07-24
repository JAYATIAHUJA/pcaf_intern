import { API_ROUTES } from '../constants.js';
import express from 'express';
import { getSettings, updateOrganisation, updateReporting, updateNotifications, getIntegrations, connectIntegration } from '../controllers/settingsController.js';
import { authenticateToken, requirePermission } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get(API_ROUTES.SETTINGS.GET, authenticateToken, requirePermission('Settings', 'view'), getSettings);
router.put(API_ROUTES.SETTINGS.UPDATE_ORG, authenticateToken, requirePermission('Settings', 'edit'), updateOrganisation);
router.put(API_ROUTES.SETTINGS.UPDATE_REP, authenticateToken, requirePermission('Settings', 'edit'), updateReporting);
router.put(API_ROUTES.SETTINGS.UPDATE_NOTIF, authenticateToken, requirePermission('Settings', 'edit'), updateNotifications);
router.get(API_ROUTES.SETTINGS.GET_INTEGRATIONS, authenticateToken, requirePermission('Settings', 'view'), getIntegrations);
router.post(API_ROUTES.SETTINGS.CONNECT_INTEGRATION, authenticateToken, requirePermission('Settings', 'edit'), connectIntegration);

export default router;
