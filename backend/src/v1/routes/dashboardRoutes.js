import { API_ROUTES } from '../constants.js';
import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticateToken, requirePermission } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get(API_ROUTES.DASHBOARD.GET, authenticateToken, requirePermission('Dashboard', 'view'), getDashboardStats);

export default router;
