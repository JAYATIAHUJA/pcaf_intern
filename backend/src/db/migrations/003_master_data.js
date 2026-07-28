export async function up(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS master_data (
      id SERIAL PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      value VARCHAR(255) NOT NULL,
      label VARCHAR(255) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(category, value)
    );
  `);
}
