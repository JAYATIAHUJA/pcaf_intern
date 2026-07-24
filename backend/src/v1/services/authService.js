import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { pool } from '../../config/db.js';
import { JWT_SECRET } from '../../config/jwt.js';
import * as userRepository from '../../repositories/userRepository.js';
import * as roleRepository from '../../repositories/roleRepository.js';
import { getCachedUser, setCachedUser, resolveUserProfile } from '../../config/cache.js';

export async function login(email, password) {
  if (!email || !password) {
    throw { statusCode: 400, message: 'Email and password are required' };
  }
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw { statusCode: 401, message: 'Invalid email or password' };
  }
  
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw { statusCode: 401, message: 'Invalid email or password' };
  }

  if (user.status !== 'active') {
    throw { statusCode: 403, message: `Account is ${user.status}` };
  }
  
  const { passwordHash, ...userClean } = user;

  // Short-lived Access Token (15m)
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
  
  // Long-lived Refresh Token (7d)
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await pool.query(
    'INSERT INTO refresh_tokens(user_id, token, expires_at) VALUES($1, $2, $3)',
    [user.id, refreshToken, expiresAt]
  );

  return { token, refreshToken, user: userClean };
}

export async function refreshToken(token) {
  if (!token) {
    throw { statusCode: 400, message: 'Refresh token is required' };
  }

  const res = await pool.query(
    'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
    [token]
  );

  if (res.rowCount === 0) {
    throw { statusCode: 401, message: 'Invalid or expired refresh token' };
  }

  const session = res.rows[0];
  const user = await userRepository.findById(session.user_id);
  if (!user || user.status !== 'active') {
    throw { statusCode: 401, message: 'User is inactive or not found' };
  }

  // Rotate Refresh Token
  const newAccessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
  const newRefreshToken = crypto.randomBytes(40).toString('hex');
  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7);

  // Delete old token, insert new token
  await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
  await pool.query(
    'INSERT INTO refresh_tokens(user_id, token, expires_at) VALUES($1, $2, $3)',
    [user.id, newRefreshToken, newExpiresAt]
  );

  return { token: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(accessToken, refreshToken) {
  // Revoke refresh token
  if (refreshToken) {
    await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
  }

  // Revoke access token
  if (accessToken) {
    let expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h fallback
    try {
      const decoded = jwt.decode(accessToken);
      if (decoded && decoded.exp) {
        expiresAt = new Date(decoded.exp * 1000);
      }
    } catch (e) {}

    await pool.query(
      'INSERT INTO revoked_tokens(token, expires_at) VALUES($1, $2) ON CONFLICT DO NOTHING',
      [accessToken, expiresAt]
    );
  }

  return { success: true };
}

export async function forgotPassword(email) {
  if (!email) {
    throw { statusCode: 400, message: 'Email is required' };
  }
  const user = await userRepository.findByEmail(email);
  if (!user) {
    return { success: true, message: 'If the email exists in our records, a reset code was generated.' };
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await pool.query(
    'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
    [resetToken, expiresAt, user.id]
  );

  return { 
    success: true, 
    message: 'Reset token generated successfully.', 
    token: resetToken 
  };
}

export async function resetPasswordWithToken(email, token, newPassword) {
  if (!email || !token || !newPassword) {
    throw { statusCode: 400, message: 'Email, token, and new password are required' };
  }

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }

  const res = await pool.query(
    'SELECT reset_token, reset_token_expires FROM users WHERE id = $1',
    [user.id]
  );

  const dbUser = res.rows[0];
  if (!dbUser.reset_token || dbUser.reset_token !== token) {
    throw { statusCode: 400, message: 'Invalid or incorrect reset token' };
  }

  if (new Date(dbUser.reset_token_expires) < new Date()) {
    throw { statusCode: 400, message: 'Reset token has expired' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await pool.query(
    'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
    [hashedPassword, user.id]
  );

  // Revoke all existing refresh sessions for security on password change/reset!
  await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [user.id]);

  return { success: true };
}

export async function changePassword(userId, currentPassword, newPassword) {
  if (!userId || !currentPassword || !newPassword) {
    throw { statusCode: 400, message: 'Current password and new password are required' };
  }

  const res = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
  if (res.rowCount === 0) {
    throw { statusCode: 404, message: 'User not found' };
  }

  const user = res.rows[0];
  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    throw { statusCode: 400, message: 'Current password is incorrect' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, userId]);

  // Revoke sessions on password change
  await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);

  return { success: true };
}

export async function verifyToken(token) {
  if (!token) {
    throw { statusCode: 401, message: 'Unauthorized' };
  }
  try {
    // Also verify that the token hasn't been revoked
    const blacklistCheck = await pool.query('SELECT 1 FROM revoked_tokens WHERE token = $1', [token]);
    if (blacklistCheck.rowCount > 0) {
      throw { statusCode: 401, message: 'Unauthorized: Token has been revoked' };
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const profile = await resolveUserProfile(decoded.id);

    return {
      user: profile.user,
      role: profile.role,
      permissions: profile.permissions
    };
  } catch (err) {
    throw { statusCode: err.statusCode || 401, message: err.message || 'Invalid or expired token' };
  }
}
