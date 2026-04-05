import runner, { RunnerOption } from 'node-pg-migrate';
import pg from 'pg';
import fs from 'fs';
import path from 'path';


function findSqlFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findSqlFiles(filePath, fileList);
    } else if (path.extname(file) === '.sql') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

export async function migrationRunner(direction: 'up' | 'down'): Promise<void> {
  process.chdir(__dirname);
  const connectionString = process.env.DATABASE_URL;
  const dbHost = process.env.POSTGRES_HOST || process.env.PGHOST;
  const shouldUseSsl = Boolean(connectionString || (dbHost && dbHost.includes('railway')) || process.env.NODE_ENV === 'production');

  const client = new pg.Client({
    connectionString,
    user: process.env.POSTGRES_USER || process.env.PGUSER,
    password: process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD,
    host: dbHost,
    database: process.env.POSTGRES_DB || process.env.PGDATABASE,
    port: Number(process.env.POSTGRES_PORT || process.env.PGPORT || 5432),
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
 
  });

  const options: RunnerOption = {
    dbClient: client,
    migrationsTable: 'migrations',
    migrationsSchema: 'public',
    schema: 'public',
    dir: '../migrations',
    checkOrder: true,
    direction: direction,
    singleTransaction: true,
    createSchema: false,
    createMigrationsSchema: false,
    noLock: false,
    fake: false,
    dryRun: false,

    verbose: false,
    decamelize: false,
  };

  await client.connect();
  console.log(`Connected to DB ${process.env.POSTGRES_DB}`);
  
  try {
    await runner(options);

    // Applying seeds
    const seedFiles = findSqlFiles('../seeds');
    for (const file of seedFiles) {
      console.log(`Applying seed file: ${file}`);
      const sql = fs.readFileSync(file).toString();
      await client.query(sql);
      console.log(`Successfully applied ${file}`);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error during migration or seeding: ', err.stack);
    } else {
      console.error('An unexpected error occurred', err);
    }
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}
