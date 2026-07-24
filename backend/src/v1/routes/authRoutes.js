import { API_ROUTES } from '../constants.js';
import express from 'express';
import { login, logout, refresh, forgotPassword, resetPassword, changePassword, me } from '../controllers/authController.js';
import { authenticateToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post(API_ROUTES.AUTH.LOGIN, login);
router.post(API_ROUTES.AUTH.LOGOUT, logout);
router.post(API_ROUTES.AUTH.REFRESH, refresh);
router.post(API_ROUTES.AUTH.FORGOT_PASSWORD, forgotPassword);
router.post(API_ROUTES.AUTH.RESET_PASSWORD, resetPassword);
router.post(API_ROUTES.AUTH.CHANGE_PASSWORD, authenticateToken, changePassword);
router.get(API_ROUTES.AUTH.ME, me);

export default router;
