import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is not set. " +
      "Please add it to your .env.local file.",
  );
}

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
