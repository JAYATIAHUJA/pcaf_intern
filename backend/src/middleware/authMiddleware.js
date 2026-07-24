import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { JWT_SECRET } from '../config/jwt.js';
import { resolveUserProfile } from '../config/cache.js';
import { ROUTE_PERMISSIONS } from '../config/permissions.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Check if the token has been revoked (blacklisted)
    const blacklistCheck = await pool.query('SELECT 1 FROM revoked_tokens WHERE token = $1', [token]);
    if (blacklistCheck.rowCount > 0) {
      return res.status(401).json({ error: 'Unauthorized: Token has been revoked' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const profile = await resolveUserProfile(decoded.id);

    req.user = profile.user;
    req.role = profile.role;
    req.permissions = profile.permissions;
    req.token = token;

    next();
  } catch (err) {
    if (err.statusCode === 403) {
      return res.status(403).json({ error: `Forbidden: ${err.message}` });
    }
    if (err.statusCode === 401) {
      return res.status(401).json({ error: `Unauthorized: ${err.message}` });
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

export function requirePermission(moduleName, action) {
  return (req, res, next) => {
    let resolvedModule = moduleName;
    let resolvedAction = action;

    // Dynamically retrieve from permissions config if not explicitly passed
    if (!resolvedModule || !resolvedAction) {
      if (req.baseUrl && req.route && req.route.path) {
        const fullRoutePath = (req.baseUrl + req.route.path).replace(/\/+$/, '') || '/';
        const key = `${req.method} ${fullRoutePath}`;
        const mapping = ROUTE_PERMISSIONS[key];
        if (mapping) {
          resolvedModule = mapping.module;
          resolvedAction = mapping.action;
        }
      }
    }

    // Special logic for audit trail if it is central vs individual
    if (req.baseUrl + (req.route?.path || '') === '/v1/audit-trail/' && !resolvedModule) {
      return next(); // Handler inside auditRoutes will handle this dynamically
    }

    if (!resolvedModule || !resolvedAction) {
      return res.status(403).json({ error: 'Forbidden: No permission configuration found for this route' });
    }

    if (!req.permissions) {
      return res.status(403).json({ error: 'Forbidden: No permissions mapping found' });
    }

    const modulePermissions = req.permissions[resolvedModule];
    if (!modulePermissions || !modulePermissions.includes(resolvedAction)) {
      return res.status(403).json({ error: `Forbidden: Insufficient permissions for ${resolvedModule} - ${resolvedAction}` });
    }

    next();
  };
}
