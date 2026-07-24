import * as userService from '../services/userService.js';
import * as auditService from '../services/auditService.js';
import * as userRepository from '../../repositories/userRepository.js';
import { clearUserCache } from '../../config/cache.js';

export async function getUsers(req, res) {
  try {
    const { search, status, roleId } = req.query;
    const users = await userService.queryUsers({ search, status, roleId });
    return res.json(users);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, roleId } = req.body;
    const result = await userService.createUser({ name, email, roleId });
    
    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Created user',
      loanId: null,
      entityType: 'User',
      changes: `Created new user account: "${result.name}" (${result.email}).`
    });

    return res.status(201).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function updateUser(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const existing = await userRepository.findById(userId);
    const result = await userService.updateUser(userId, req.body);
    clearUserCache(userId);
    
    let changesDesc = `Updated details for user "${result.name}".`;
    if (req.body.roleId !== undefined && req.body.roleId !== existing.roleId) {
      changesDesc += ` Role ID changed from ${existing.roleId} to ${req.body.roleId}.`;
    }
    if (req.body.status !== undefined && req.body.status !== existing.status) {
      changesDesc += ` Status changed from "${existing.status}" to "${req.body.status}".`;
    }

    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Updated user',
      loanId: null,
      entityType: 'User',
      changes: changesDesc
    });

    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function activateUser(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const result = await userService.activateUser(userId);
    clearUserCache(userId);
    
    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Activated user',
      loanId: null,
      entityType: 'User',
      changes: `Activated user account: "${result.name}" (${result.email}).`
    });

    return res.json({ message: 'User activated successfully', user: result });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function deactivateUser(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const result = await userService.deactivateUser(userId);
    clearUserCache(userId);
    
    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Deactivated user',
      loanId: null,
      entityType: 'User',
      changes: `Deactivated user account: "${result.name}" (${result.email}).`
    });

    return res.json({ message: 'User deactivated successfully', user: result });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const existing = await userRepository.findById(userId);
    const deleted = await userService.deleteUser(userId);
    clearUserCache(userId);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    
    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Deleted user',
      loanId: null,
      entityType: 'User',
      changes: `Deleted user account: "${existing ? existing.name : 'Unknown'}" (ID: ${userId}).`
    });

    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function resetPassword(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const targetUser = await userRepository.findById(userId);
    await userService.resetPassword(userId);
    clearUserCache(userId);
    
    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Reset user password',
      loanId: null,
      entityType: 'User',
      changes: `Administratively reset password for user: "${targetUser ? targetUser.name : 'Unknown'}" to default.`
    });

    return res.json({ message: 'Password reset to default successfully' });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}
