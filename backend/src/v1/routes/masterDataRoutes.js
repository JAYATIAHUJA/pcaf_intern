import { API_ROUTES } from '../constants.js';
import express from 'express';
import { createMasterData, deleteMasterData, getMasterData, updateMasterData } from '../controllers/masterDataController.js';
import { authenticateToken, requirePermission } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get(API_ROUTES.MASTER_DATA.GET_ALL, authenticateToken, requirePermission('Settings', 'view'), getMasterData);
router.post(API_ROUTES.MASTER_DATA.CREATE, authenticateToken, requirePermission('Settings', 'edit'), createMasterData);
router.put(API_ROUTES.MASTER_DATA.UPDATE, authenticateToken, requirePermission('Settings', 'edit'), updateMasterData);
router.delete(API_ROUTES.MASTER_DATA.DELETE, authenticateToken, requirePermission('Settings', 'edit'), deleteMasterData);

export default router;
