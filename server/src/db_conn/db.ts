import { Pool, QueryResult } from 'pg';

const connectionString = process.env.DATABASE_URL;
const dbHost = process.env.POSTGRES_HOST || process.env.PGHOST;
const shouldUseSsl = Boolean(connectionString || (dbHost && dbHost.includes('railway')) || process.env.NODE_ENV === 'production');

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
      }
    : {
        user: process.env.POSTGRES_USER || process.env.PGUSER,
        host: dbHost,
        database: process.env.POSTGRES_DB || process.env.PGDATABASE || 'tracker',
        password: process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD,
        port: Number(process.env.POSTGRES_PORT || process.env.PGPORT || 5432),
        ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
      }
);

export const query = (text: string, params?: any[]): Promise<QueryResult> => {
    return pool.query(text, params || []);
};
