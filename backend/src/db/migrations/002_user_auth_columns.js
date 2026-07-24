export async function up(client) {
  // 1. Add password_hash if it doesn't exist
  await client.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) DEFAULT '$2b$10$uX6brpGjFZCHXBuHEuIh7eK932Cl8JzSQTkZ25evFOUijK3iaEF0C';
  `);

  // 2. Set default password for existing users if null
  await client.query(`
    UPDATE users SET password_hash = '$2b$10$uX6brpGjFZCHXBuHEuIh7eK932Cl8JzSQTkZ25evFOUijK3iaEF0C' WHERE password_hash IS NULL;
  `);

  // 3. Update old SHA-256 password hash users to new bcrypt default
  await client.query(`
    UPDATE users 
    SET password_hash = '$2b$10$uX6brpGjFZCHXBuHEuIh7eK932Cl8JzSQTkZ25evFOUijK3iaEF0C' 
    WHERE password_hash = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
  `);

  // 4. Add reset_token columns to users if they don't exist
  await client.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
  `);
  await client.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;
  `);
}
