export async function up(client) {
  // 1. Roles Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      color VARCHAR(7) DEFAULT '#94a3b8',
      description TEXT,
      users INTEGER DEFAULT 0
    );
  `);

  // 2. Permissions Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS permissions (
      role_id INTEGER PRIMARY KEY REFERENCES roles(id) ON DELETE CASCADE,
      dashboard TEXT[] DEFAULT '{}',
      data_capture TEXT[] DEFAULT '{}',
      loan_configuration TEXT[] DEFAULT '{}',
      user_management TEXT[] DEFAULT '{}',
      role_management TEXT[] DEFAULT '{}',
      settings TEXT[] DEFAULT '{}',
      reports TEXT[] DEFAULT '{}',
      audit_trail TEXT[] DEFAULT '{}'
    );
  `);

  // 3. Users Table (Baseline schema without auth columns)
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
      status VARCHAR(20) DEFAULT 'active'
    );
  `);

  // 4. Refresh Tokens Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Revoked Access Tokens Table (Blacklist)
  await client.query(`
    CREATE TABLE IF NOT EXISTS revoked_tokens (
      id SERIAL PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL
    );
  `);

  // 6. Audit Logs Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      user_name VARCHAR(150),
      action VARCHAR(100) NOT NULL,
      loan_id VARCHAR(100),
      entity_type VARCHAR(100),
      changes TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Settings Organisation Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS settings_organisation (
      id INTEGER PRIMARY KEY DEFAULT 1,
      name VARCHAR(255),
      lei VARCHAR(50),
      country VARCHAR(100),
      pcaf_signatory_since VARCHAR(10)
    );
  `);

  // 8. Settings Reporting Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS settings_reporting (
      id INTEGER PRIMARY KEY DEFAULT 1,
      fiscal_year VARCHAR(100),
      currency VARCHAR(100),
      emission_factor_source VARCHAR(255),
      consolidation_approach VARCHAR(100)
    );
  `);

  // 9. Settings Notifications Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS settings_notifications (
      id INTEGER PRIMARY KEY DEFAULT 1,
      pending_approvals BOOLEAN DEFAULT TRUE,
      data_quality_drops BOOLEAN DEFAULT TRUE,
      emission_updates BOOLEAN DEFAULT FALSE,
      monthly_summary BOOLEAN DEFAULT TRUE
    );
  `);

  // 10. Integrations Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS integrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      status VARCHAR(50) DEFAULT 'Not connected'
    );
  `);

  // 11. Loan Configurations Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS loan_configurations (
      id SERIAL PRIMARY KEY,
      loan_id VARCHAR(100) UNIQUE NOT NULL,
      asset_class VARCHAR(50) NOT NULL,
      borrower_name VARCHAR(255) NOT NULL,
      borrower_type VARCHAR(100),
      sector VARCHAR(255),
      city VARCHAR(100),
      country VARCHAR(100),
      borrower_reg_no VARCHAR(100),
      loan_amount NUMERIC DEFAULT 0,
      loan_tenure INTEGER DEFAULT 0,
      loan_start_date VARCHAR(10),
      loan_end_date VARCHAR(10),
      loan_status VARCHAR(20) DEFAULT 'Active',
      extra_data JSONB DEFAULT '{}'::jsonb
    );
  `);

  // 12. Data Captures Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS data_captures (
      id SERIAL PRIMARY KEY,
      activity_period VARCHAR(20) NOT NULL,
      loan_id VARCHAR(100) REFERENCES loan_configurations(loan_id) ON DELETE CASCADE,
      outstanding_amount NUMERIC DEFAULT 0,
      data_quality VARCHAR(5),
      financed_emissions NUMERIC DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Pending for Capture',
      extra_data JSONB DEFAULT '{}'::jsonb
    );
  `);
}
