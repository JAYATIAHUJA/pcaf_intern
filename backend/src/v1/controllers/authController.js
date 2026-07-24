import * as authService from '../services/authService.js';
import * as auditService from '../services/auditService.js';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    await auditService.logAction({
      userId: result.user.id,
      userName: result.user.name,
      action: 'User logged in',
      loanId: null,
      entityType: 'Auth',
      changes: `Logged in successfully.`
    });

    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function logout(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const { refreshToken } = req.body;
    
    let decoded = null;
    if (accessToken) {
      try {
        decoded = jwt.decode(accessToken);
      } catch (e) {}
    }

    await authService.logout(accessToken, refreshToken);
    
    if (decoded) {
      await auditService.logAction({
        userId: decoded.id,
        userName: decoded.email,
        action: 'User logged out',
        loanId: null,
        entityType: 'Auth',
        changes: `Logged out successfully.`
      });
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, token, password } = req.body;
    const result = await authService.resetPasswordWithToken(email, token, password);
    
    await auditService.logAction({
      userId: null,
      userName: email,
      action: 'Reset password',
      loanId: null,
      entityType: 'Auth',
      changes: `Password reset successfully via verification token.`
    });

    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const result = await authService.changePassword(userId, currentPassword, newPassword);

    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Changed password',
      loanId: null,
      entityType: 'Auth',
      changes: `Updated account password securely.`
    });

    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function me(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const result = await authService.verifyToken(token);
    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}
