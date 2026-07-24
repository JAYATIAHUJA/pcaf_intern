import { pool } from '../config/db.js';

export async function getAll() {
  const query = `
    SELECT r.id, r.name, r.color, r.description as desc, COALESCE(COUNT(u.id), 0)::integer as users
    FROM roles r
    LEFT JOIN users u ON r.id = u.role_id
    GROUP BY r.id
    ORDER BY r.id ASC
  `;
  const res = await pool.query(query);
  return res.rows;
}

export async function findById(id) {
  const query = `
    SELECT r.id, r.name, r.color, r.description as desc, COALESCE(COUNT(u.id), 0)::integer as users
    FROM roles r
    LEFT JOIN users u ON r.id = u.role_id
    WHERE r.id = $1
    GROUP BY r.id
  `;
  const res = await pool.query(query, [id]);
  if (res.rowCount === 0) return null;
  return res.rows[0];
}

export async function add({ name, color, desc }) {
  const res = await pool.query(
    'INSERT INTO roles(name, color, description) VALUES($1, $2, $3) RETURNING id, name, color, description as desc',
    [name, color || '#94a3b8', desc || '']
  );
  const newRole = res.rows[0];
  newRole.users = 0;

  // Initialize empty permissions matrix
  await pool.query(
    'INSERT INTO permissions(role_id, dashboard, data_capture, loan_configuration, user_management, role_management, settings, reports, audit_trail) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    [newRole.id, [], [], [], [], [], [], [], []]
  );

  return newRole;
}

export async function update(id, updates) {
  const keys = Object.keys(updates);
  if (keys.length === 0) return findById(id);

  const fieldMapping = {
    name: 'name',
    color: 'color',
    desc: 'description'
  };

  const setClause = [];
  const queryValues = [id];
  let valIndex = 2;

  for (const k of keys) {
    const dbField = fieldMapping[k];
    if (dbField) {
      setClause.push(`"${dbField}" = $${valIndex}`);
      queryValues.push(updates[k]);
      valIndex++;
    }
  }

  if (setClause.length > 0) {
    const queryText = `UPDATE roles SET ${setClause.join(', ')} WHERE id = $1`;
    await pool.query(queryText, queryValues);
  }

  return findById(id);
}

export async function deleteById(id) {
  const res = await pool.query('DELETE FROM roles WHERE id = $1', [id]);
  return res.rowCount > 0;
}

export async function getPermissions(roleId) {
  const res = await pool.query('SELECT * FROM permissions WHERE role_id = $1', [roleId]);
  if (res.rowCount === 0) return null;
  const row = res.rows[0];
  return {
    Dashboard: row.dashboard || [],
    'Data Capture': row.data_capture || [],
    'Loan Configuration': row.loan_configuration || [],
    'User Management': row.user_management || [],
    'Role Management': row.role_management || [],
    Settings: row.settings || [],
    Reports: row.reports || [],
    'Audit Trail': row.audit_trail || []
  };
}

export async function updatePermissions(roleId, perms) {
  const keys = Object.keys(perms);
  if (keys.length === 0) return getPermissions(roleId);

  const fieldMapping = {
    Dashboard: 'dashboard',
    'Data Capture': 'data_capture',
    'Loan Configuration': 'loan_configuration',
    'User Management': 'user_management',
    'Role Management': 'role_management',
    Settings: 'settings',
    Reports: 'reports',
    'Audit Trail': 'audit_trail'
  };

  const setClause = [];
  const queryValues = [roleId];
  let valIndex = 2;

  for (const k of keys) {
    const dbField = fieldMapping[k];
    if (dbField) {
      setClause.push(`"${dbField}" = $${valIndex}`);
      queryValues.push(perms[k]);
      valIndex++;
    }
  }

  if (setClause.length > 0) {
    const queryText = `UPDATE permissions SET ${setClause.join(', ')} WHERE role_id = $1`;
    await pool.query(queryText, queryValues);
  }

  return getPermissions(roleId);
}
