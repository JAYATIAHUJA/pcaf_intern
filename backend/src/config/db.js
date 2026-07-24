import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

if (!process.env.PGDATABASE || !process.env.PGPASSWORD) {
  throw new Error('Database credentials (PGDATABASE, PGPASSWORD) are missing in .env');
}

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE
});

export { pool };
