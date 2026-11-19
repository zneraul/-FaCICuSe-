import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = drizzle(pool, { schema });
export { pool };

export async function verifyDatabaseConnection() {
  try {
    await pool.query('SELECT 1');
  } catch (error) {
    throw new Error(
      `Unable to connect to PostgreSQL database (${process.env.SQL_DB_NAME || 'unconfigured'} at ${process.env.SQL_HOST || 'unconfigured'}). Check SQL_* environment variables and database availability.`,
      { cause: error }
    );
  }
}
