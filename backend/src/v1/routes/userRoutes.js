import { API_ROUTES } from '../constants.js';
import express from 'express';
import { getUsers, createUser, updateUser, activateUser, deactivateUser, deleteUser, resetPassword } from '../controllers/userController.js';
import { authenticateToken, requirePermission } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get(API_ROUTES.USERS.GET_ALL, authenticateToken, requirePermission('User Management', 'view'), getUsers);
router.post(API_ROUTES.USERS.CREATE, authenticateToken, requirePermission('User Management', 'create'), createUser);
router.put(API_ROUTES.USERS.UPDATE, authenticateToken, requirePermission('User Management', 'edit'), updateUser);
router.delete(API_ROUTES.USERS.DELETE, authenticateToken, requirePermission('User Management', 'delete'), deleteUser);
router.post(API_ROUTES.USERS.ACTIVATE, authenticateToken, requirePermission('User Management', 'edit'), activateUser);
router.post(API_ROUTES.USERS.DEACTIVATE, authenticateToken, requirePermission('User Management', 'edit'), deactivateUser);
router.post(API_ROUTES.USERS.RESET_PASSWORD, authenticateToken, requirePermission('User Management', 'edit'), resetPassword);

export default router;

