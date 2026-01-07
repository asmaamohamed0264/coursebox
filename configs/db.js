import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';

// Folosim doar Neon serverless care funcționează și cu PostgreSQL standard
// prin protocol HTTP, perfect pentru Next.js
const connectionString = process.env.NEXT_PUBLIC_DB_CONNECTION_STRING || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or NEXT_PUBLIC_DB_CONNECTION_STRING is not set');
}

// Convertim connection string pentru Neon serverless (funcționează cu orice PostgreSQL)
// Neon serverless poate lucra cu orice PostgreSQL dacă este accesibil prin HTTP
// Pentru PostgreSQL standard pe Docker, folosim connection string-ul direct
const sql = neon(connectionString);
const db = drizzleNeon(sql);

export { db };
