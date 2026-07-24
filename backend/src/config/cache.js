import * as userRepository from '../repositories/userRepository.js';
import * as roleRepository from '../repositories/roleRepository.js';

const userCache = new Map();
const CACHE_TTL_MS = 8 * 60 * 60 * 1000; // 8-hour cache slot

export function getCachedUser(userId) {
  const cached = userCache.get(Number(userId));
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.cachedAt > CACHE_TTL_MS) {
    userCache.delete(Number(userId));
    return null;
  }
  return cached;
}

export function setCachedUser(userId, data) {
  userCache.set(Number(userId), {
    ...data,
    cachedAt: Date.now()
  });
}

export function clearUserCache(userId) {
  userCache.delete(Number(userId));
}

export function clearAllUserCache() {
  userCache.clear();
}

/**
 * Resolves user details, role, and permissions dynamically, applying cache,
 * database fallback, default fallback for role-less users, and active status validation.
 */
export async function resolveUserProfile(userId) {
  const uId = Number(userId);
  let cached = getCachedUser(uId);

  if (!cached) {
    const user = await userRepository.findById(uId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    let role = null;
    let permissions = {};

    if (user.roleId) {
      role = await roleRepository.findById(user.roleId);
      const dbPerms = await roleRepository.getPermissions(user.roleId);
      permissions = dbPerms || {};
    }

    if (!role) {
      role = { name: 'Viewer' };
      permissions = {
        'Dashboard': ['view'],
        'Data Capture': ['view'],
        'Loan Configuration': ['view']
      };
    }

    cached = {
      user,
      role: role.name,
      permissions
    };
    setCachedUser(uId, cached);
  }

  if (cached.user.status !== 'active') {
    const error = new Error(`Account is ${cached.user.status}`);
    error.statusCode = 403;
    throw error;
  }

  return cached;
}
