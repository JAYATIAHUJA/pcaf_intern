export async function seed(client) {
  console.log('Upserting requested Jayati demo users...');

  const users = [
    {
      id: 1,
      name: 'jayati',
      email: 'jayati@pcaf.local',
      roleId: 1,
      status: 'active',
      passwordHash: '$2b$10$UoftC3b3iDLDB2wdBQxjle7nNK3Hxg2ZGKV4.AYGHAvqF8yM0xMiu'
    },
    {
      id: 6,
      name: 'jayati2',
      email: 'jayati2@pcaf.local',
      roleId: 4,
      status: 'active',
      passwordHash: '$2b$10$mGW9Yr5G5MYta06Yu2U9xe3uXaS11OISeXFdgvWF.0Zabb.GASmo.'
    }
  ];

  for (const user of users) {
    await client.query(
      `INSERT INTO users(id, name, email, role_id, status, password_hash)
       VALUES($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         email = EXCLUDED.email,
         role_id = EXCLUDED.role_id,
         status = EXCLUDED.status,
         password_hash = EXCLUDED.password_hash`,
      [user.id, user.name, user.email, user.roleId, user.status, user.passwordHash]
    );
  }

  await client.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`);
}
