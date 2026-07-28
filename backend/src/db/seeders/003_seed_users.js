export async function seed(client) {
  const usersCheck = await client.query('SELECT COUNT(*) FROM users');
  if (parseInt(usersCheck.rows[0].count) === 0) {
    console.log('Seeding initial users...');
    const seededUsers = [
      { id: 1, name: 'jayati', email: 'jayati@pcaf.local', roleId: 1, status: 'active' },
      { id: 2, name: 'Bob Jones', email: 'bob@example.com', roleId: 2, status: 'inactive' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', roleId: 3, status: 'pending' },
      { id: 4, name: 'Arjun Kapoor', email: 'a.kapoor@meridian.com', roleId: 1, status: 'active' },
      { id: 5, name: 'Demo Analyst', email: 'analyst@bankorg.com', roleId: 3, status: 'active' },
      { id: 6, name: 'jayati2', email: 'jayati2@pcaf.local', roleId: 4, status: 'active' }
    ];

    for (const u of seededUsers) {
      await client.query(
        `INSERT INTO users(id, name, email, role_id, status) VALUES($1, $2, $3, $4, $5)`,
        [u.id, u.name, u.email, u.roleId, u.status]
      );
    }
    // Reset sequence
    await client.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`);
  }
}


