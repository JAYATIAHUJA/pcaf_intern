import { API_ROUTES } from '../constants.js';
import express from 'express';
import { getDataCaptures, updateDataCapture, approveDataCaptures, rejectDataCaptures } from '../controllers/dataCaptureController.js';
import { authenticateToken, requirePermission } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get(API_ROUTES.DATA_CAPTURE.GET_ALL, authenticateToken, requirePermission('Data Capture', 'view'), getDataCaptures);
router.put(API_ROUTES.DATA_CAPTURE.UPDATE, authenticateToken, requirePermission('Data Capture', 'edit'), updateDataCapture);
router.post(API_ROUTES.DATA_CAPTURE.APPROVE, authenticateToken, requirePermission('Data Capture', 'approve'), approveDataCaptures);
router.post(API_ROUTES.DATA_CAPTURE.REJECT, authenticateToken, requirePermission('Data Capture', 'approve'), rejectDataCaptures);

export default router;
