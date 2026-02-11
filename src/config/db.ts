import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_VN9HSo0PKvJt@ep-divine-bush-aind4397-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const globalForPool = globalThis as typeof globalThis & {
  neonPool?: Pool;
};

export const pool =
  globalForPool.neonPool ??
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

if (!globalForPool.neonPool) {
  globalForPool.neonPool = pool;
}

export const db = {
  query: (text: string, params?: Array<unknown>) => pool.query(text, params),
};
