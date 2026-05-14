import { Pool, QueryResult } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

console.log('DB INIT DATABASE_URL:', !!connectionString);

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

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