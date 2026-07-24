export async function seed(client) {
  const rolesCheck = await client.query('SELECT COUNT(*) FROM roles');
  if (parseInt(rolesCheck.rows[0].count) === 0) {
    console.log('Seeding initial roles...');
    const seededRoles = [
      { id: 1, name: 'Super Admin',  users: 2,  color: '#7c3aed', desc: 'Full platform access including system configuration' },
      { id: 2, name: 'Risk Officer', users: 4,  color: '#6366f1', desc: 'Can approve / reject data capture records' },
      { id: 3, name: 'Data Analyst', users: 12, color: '#0ea5e9', desc: 'Can create, edit, and submit emission records' },
      { id: 4, name: 'Viewer',       users: 8,  color: '#94a3b8', desc: 'Read-only access to dashboards and reports' },
      { id: 5, name: 'Auditor',      users: 3,  color: '#f59e0b', desc: 'Access to audit trail and data quality reports' },
    ];

    for (const r of seededRoles) {
      await client.query(
        `INSERT INTO roles(id, name, color, description, users) VALUES($1, $2, $3, $4, $5)`,
        [r.id, r.name, r.color, r.desc, r.users]
      );
    }
    // Reset serial id sequence
    await client.query(`SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles))`);
  }
}
