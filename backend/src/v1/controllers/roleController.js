import * as roleService from '../services/roleService.js';
import { clearAllUserCache } from '../../config/cache.js';

export async function getRoles(req, res) {
  try {
    const roles = await roleService.fetchRoles();
    return res.json(roles);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function createRole(req, res) {
  try {
    const { name, color, desc } = req.body;
    const newRole = await roleService.createRole({ name, color, desc });
    return res.status(201).json(newRole);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function updateRole(req, res) {
  try {
    const roleId = parseInt(req.params.id);
    const updatedRole = await roleService.updateRole(roleId, req.body);
    clearAllUserCache();
    return res.json(updatedRole);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function deleteRole(req, res) {
  try {
    const roleId = parseInt(req.params.id);
    await roleService.deleteRole(roleId);
    return res.status(204).send();
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function getRolePermissions(req, res) {
  try {
    const roleId = parseInt(req.params.id);
    const perms = await roleService.getPermissionsForRole(roleId);
    return res.json(perms);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function updateRolePermissions(req, res) {
  try {
    const roleId = parseInt(req.params.id);
    const updatedPerms = await roleService.updatePermissionsForRole(roleId, req.body);
    clearAllUserCache();
    return res.json(updatedPerms);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}
