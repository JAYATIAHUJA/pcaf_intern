import { API_ROUTES } from '../constants.js';
import express from 'express';
import { getRoles, createRole, updateRole, deleteRole, getRolePermissions, updateRolePermissions } from '../controllers/roleController.js';
import { authenticateToken, requirePermission } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get(API_ROUTES.ROLES.GET_ALL, authenticateToken, requirePermission('Role Management', 'view'), getRoles);
router.post(API_ROUTES.ROLES.CREATE, authenticateToken, requirePermission('Role Management', 'create'), createRole);
router.put(API_ROUTES.ROLES.UPDATE, authenticateToken, requirePermission('Role Management', 'edit'), updateRole);
router.delete(API_ROUTES.ROLES.DELETE, authenticateToken, requirePermission('Role Management', 'delete'), deleteRole);
router.get(API_ROUTES.ROLES.GET_PERMISSIONS, authenticateToken, requirePermission('Role Management', 'view'), getRolePermissions);
router.put(API_ROUTES.ROLES.UPDATE_PERMISSIONS, authenticateToken, requirePermission('Role Management', 'edit'), updateRolePermissions);

export default router;
