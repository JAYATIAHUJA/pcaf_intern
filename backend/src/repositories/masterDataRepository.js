import { pool } from '../config/db.js';

function mapRow(row) {
  return {
    id: row.id,
    category: row.category,
    value: row.value,
    label: row.label,
    isActive: row.is_active,
    sortOrder: row.sort_order
  };
}

export async function getAll() {
  const res = await pool.query(`
    SELECT * FROM master_data
    ORDER BY category ASC, sort_order ASC, label ASC
  `);
  return res.rows.map(mapRow);
}

export async function getByCategory(category, activeOnly = false) {
  const res = await pool.query(
    `SELECT * FROM master_data
     WHERE category = $1 AND ($2::boolean = FALSE OR is_active = TRUE)
     ORDER BY sort_order ASC, label ASC`,
    [category, activeOnly]
  );
  return res.rows.map(mapRow);
}

export async function create(option) {
  const { category, value, label, sortOrder } = option;
  const res = await pool.query(
    `INSERT INTO master_data(category, value, label, is_active, sort_order)
     VALUES($1, $2, $3, TRUE, $4)
     RETURNING *`,
    [category, value, label || value, Number(sortOrder || 0)]
  );
  return mapRow(res.rows[0]);
}

export async function update(id, option) {
  const res = await pool.query('SELECT * FROM master_data WHERE id = $1', [id]);
  if (res.rowCount === 0) return null;
  const current = res.rows[0];

  const updated = await pool.query(
    `UPDATE master_data
     SET category = $1, value = $2, label = $3, is_active = $4, sort_order = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING *`,
    [
      option.category !== undefined ? option.category : current.category,
      option.value !== undefined ? option.value : current.value,
      option.label !== undefined ? option.label : current.label,
      option.isActive !== undefined ? option.isActive : current.is_active,
      option.sortOrder !== undefined ? Number(option.sortOrder) : current.sort_order,
      id
    ]
  );
  return mapRow(updated.rows[0]);
}

export async function remove(id) {
  const res = await pool.query(
    `UPDATE master_data SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
    [id]
  );
  return res.rowCount > 0;
}
