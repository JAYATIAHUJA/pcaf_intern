import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  if (!process.env.PGDATABASE || !process.env.PGPASSWORD) {
    throw new Error('Database credentials (PGDATABASE, PGPASSWORD) are missing in .env');
  }

  const connectionConfig = {
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432')
  };

  const dbName = process.env.PGDATABASE;
  const defaultClient = new Client({ ...connectionConfig, database: 'postgres' });

  // 1. Connect to default postgres db to ensure the target database exists
  try {
    await defaultClient.connect();
    const checkDbResult = await defaultClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkDbResult.rowCount === 0) {
      console.log(`[Schema Manager] Database "${dbName}" does not exist. Creating...`);
      await defaultClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`[Schema Manager] Database "${dbName}" created successfully.`);
    }
  } catch (err) {
    console.error('[Schema Manager] Error checking/creating database:', err);
    throw err;
  } finally {
    await defaultClient.end();
  }

  // 2. Connect to the target database to run migrations and seeders
  const client = new Client({ ...connectionConfig, database: dbName });
  try {
    await client.connect();
    console.log(`[Schema Manager] Connected to "${dbName}" for schema management.`);

    // --- MIGRATIONS ---
    // Ensure migrations_meta table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations_meta (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const executedMigrationsRes = await client.query('SELECT name FROM migrations_meta');
    const executedMigrations = new Set(executedMigrationsRes.rows.map(r => r.name));

    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js'))
      .sort();

    for (const file of migrationFiles) {
      if (!executedMigrations.has(file)) {
        console.log(`[Schema Manager] Running migration: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const fileUrl = new URL(`file://${filePath.replace(/\\/g, '/')}`);
        const migration = await import(fileUrl);

        await client.query('BEGIN');
        try {
          await migration.up(client);
          await client.query('INSERT INTO migrations_meta (name) VALUES ($1)', [file]);
          await client.query('COMMIT');
          console.log(`[Schema Manager] Migration ${file} executed successfully.`);
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`[Schema Manager] Migration ${file} failed. Rolled back.`, err);
          throw err;
        }
      } else {
        console.log(`[Schema Manager] Migration ${file} already run.`);
      }
    }

    // --- SEEDERS ---
    // Ensure seeders_meta table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS seeders_meta (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const executedSeedersRes = await client.query('SELECT name FROM seeders_meta');
    const executedSeeders = new Set(executedSeedersRes.rows.map(r => r.name));

    const seedersDir = path.join(__dirname, 'seeders');
    const seederFiles = fs.readdirSync(seedersDir)
      .filter(f => f.endsWith('.js'))
      .sort();

    for (const file of seederFiles) {
      if (!executedSeeders.has(file)) {
        console.log(`[Schema Manager] Running seeder: ${file}`);
        const filePath = path.join(seedersDir, file);
        const fileUrl = new URL(`file://${filePath.replace(/\\/g, '/')}`);
        const seeder = await import(fileUrl);

        await client.query('BEGIN');
        try {
          await seeder.seed(client);
          await client.query('INSERT INTO seeders_meta (name) VALUES ($1)', [file]);
          await client.query('COMMIT');
          console.log(`[Schema Manager] Seeder ${file} executed successfully.`);
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`[Schema Manager] Seeder ${file} failed. Rolled back.`, err);
          throw err;
        }
      } else {
        console.log(`[Schema Manager] Seeder ${file} already run.`);
      }
    }

    console.log('[Schema Manager] Database schema and data synchronization complete.');
  } catch (err) {
    console.error('[Schema Manager] Initialization sequence failed:', err);
    throw err;
  } finally {
    await client.end();
  }
}
