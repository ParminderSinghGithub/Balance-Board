import { Pool, QueryResult } from 'pg';

const connectionString = process.env.DATABASE_URL;
const dbHost = process.env.POSTGRES_HOST || process.env.PGHOST;

console.log('DB INIT DATABASE_URL:', !!connectionString);
console.log('DB INIT HOST:', dbHost);

const shouldUseSsl =
  Boolean(
    connectionString ||
    (dbHost && dbHost.includes('railway')) ||
    process.env.NODE_ENV === 'production'
  );

const poolConfig = connectionString
  ? {
      connectionString,
      ssl: shouldUseSsl
        ? { rejectUnauthorized: false }
        : undefined,
    }
  : {
      user: process.env.POSTGRES_USER || process.env.PGUSER,
      host: dbHost,
      database:
        process.env.POSTGRES_DB ||
        process.env.PGDATABASE ||
        'tracker',
      password:
        process.env.POSTGRES_PASSWORD ||
        process.env.PGPASSWORD,
      port: Number(
        process.env.POSTGRES_PORT ||
        process.env.PGPORT ||
        5432
      ),
      ssl: shouldUseSsl
        ? { rejectUnauthorized: false }
        : undefined,
    };

console.log('DB SSL ENABLED:', shouldUseSsl);

const pool = new Pool(poolConfig);

pool
  .connect()
  .then((client) => {
    console.log('Database connected successfully');
    client.release();
  })
  .catch((err) => {
    console.error('Database connection failed');
    console.error(err);
  });

export const query = (
  text: string,
  params?: any[]
): Promise<QueryResult> => {
  return pool.query(text, params || []);
};

export default pool;