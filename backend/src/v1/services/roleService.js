import * as roleRepository from '../../repositories/roleRepository.js';

export async function fetchRoles() {
  return await roleRepository.getAll();
}

export async function createRole({ name, color, desc }) {
  if (!name) {
    throw { statusCode: 400, message: 'Role name is required' };
  }
  const roles = await roleRepository.getAll();
  const newId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
  const newRole = {
    id: newId,
    name,
    color: color || '#94a3b8',
    desc: desc || '',
    users: 0
  };
  return await roleRepository.add(newRole);
}

export async function updateRole(id, updates) {
  const role = await roleRepository.findById(id);
  if (!role) {
    throw { statusCode: 404, message: 'Role not found' };
  }
  return await roleRepository.update(id, updates);
}

export async function deleteRole(id) {
  const success = await roleRepository.deleteById(id);
  if (!success) {
    throw { statusCode: 404, message: 'Role not found' };
  }
  return true;
}

export async function getPermissionsForRole(roleId) {
  const perms = await roleRepository.getPermissions(roleId);
  if (!perms) {
    throw { statusCode: 404, message: 'Permissions not found for this role' };
  }
  return perms;
}

export async function updatePermissionsForRole(roleId, perms) {
  const updatedPerms = await roleRepository.updatePermissions(roleId, perms);
  if (!updatedPerms) {
    throw { statusCode: 404, message: 'Role not found' };
  }
  return updatedPerms;
}
