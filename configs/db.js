import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import postgres from 'postgres';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';

// Detectează tipul de conexiune bazat pe connection string
const connectionString = process.env.NEXT_PUBLIC_DB_CONNECTION_STRING || process.env.DATABASE_URL;

let db;

if (connectionString?.includes('neon.tech') || connectionString?.includes('neon.tech')) {
  // Folosește Neon Database (serverless)
  const sql = neon(connectionString);
  db = drizzleNeon(sql);
} else {
  // Folosește PostgreSQL standard
  const client = postgres(connectionString);
  db = drizzlePostgres(client);
}

export { db };
