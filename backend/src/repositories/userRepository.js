import { pool } from '../config/db.js';

export async function getAll() {
  const res = await pool.query('SELECT * FROM users ORDER BY id ASC');
  return res.rows.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    roleId: row.role_id,
    status: row.status
  }));
}

export async function findById(id) {
  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  if (res.rowCount === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    roleId: row.role_id,
    status: row.status
  };
}

export async function findByEmail(email) {
  const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  if (res.rowCount === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    roleId: row.role_id,
    status: row.status,
    passwordHash: row.password_hash
  };
}

export async function add({ name, email, roleId, status }) {
  const res = await pool.query(
    'INSERT INTO users(name, email, role_id, status) VALUES($1, $2, $3, $4) RETURNING *',
    [name, email, roleId, status || 'active']
  );
  const row = res.rows[0];
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    roleId: row.role_id,
    status: row.status
  };
}

export async function deleteById(id) {
  const res = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return res.rowCount > 0;
}

export async function updatePasswordHash(id, hash) {
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, id]);
  return findById(id);
}

export async function update(id, updates) {
  const keys = Object.keys(updates);
  if (keys.length === 0) return findById(id);

  const fieldMapping = {
    name: 'name',
    email: 'email',
    roleId: 'role_id',
    status: 'status'
  };

  const setClause = [];
  const queryValues = [id];
  let valIndex = 2;

  for (const k of keys) {
    const dbField = fieldMapping[k] || k;
    setClause.push(`"${dbField}" = $${valIndex}`);
    queryValues.push(updates[k]);
    valIndex++;
  }

  const queryText = `UPDATE users SET ${setClause.join(', ')} WHERE id = $1 RETURNING *`;
  const res = await pool.query(queryText, queryValues);
  
  if (res.rowCount === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    roleId: row.role_id,
    status: row.status
  };
}
