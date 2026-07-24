import { pool } from '../../config/db.js';

/**
 * Log an activity to the audit_logs table
 * @param {object} params
 * @param {number} params.userId - ID of the user performing action
 * @param {string} params.userName - Fallback name of the user
 * @param {string} params.action - Action performed (e.g. Created draft, Edited draft, Submitted, Approved, Rejected)
 * @param {string} [params.loanId] - Loan ID associated with the changes
 * @param {string} params.entityType - Type of entity ('Data Capture', 'Loan Configuration', 'User', 'Settings', 'Auth')
 * @param {string} params.changes - Details of the fields modified or log details
 */
export async function logAction({ userId, userName, action, loanId, entityType, changes }) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, user_name, action, loan_id, entity_type, changes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId || null, userName || 'System', action, loanId || null, entityType, changes]
    );
  } catch (err) {
    console.error('[Audit Log Error] Failed to write log:', err);
  }
}

/**
 * Retrieve audit logs, sorted chronologically descending
 * @param {object} filter
 * @param {string} [filter.loanId]
 * @param {string} [filter.entityType]
 */
export async function getAuditLogs({ loanId, entityType } = {}) {
  let query = `
    SELECT 
      a.id, 
      a.user_id as "userId", 
      COALESCE(u.name, a.user_name) as "userName", 
      a.action, 
      a.loan_id as "loanId", 
      a.entity_type as "entityType", 
      a.changes, 
      a.created_at as "createdAt"
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.id
  `;
  const params = [];
  const conditions = [];

  if (loanId) {
    conditions.push(`a.loan_id = $${params.length + 1}`);
    params.push(loanId);
  }
  if (entityType) {
    conditions.push(`a.entity_type = $${params.length + 1}`);
    params.push(entityType);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY a.created_at DESC';

  const res = await pool.query(query, params);
  return res.rows;
}
