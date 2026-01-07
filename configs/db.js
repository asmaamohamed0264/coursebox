import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';

// Folosim doar Neon serverless care funcționează și cu PostgreSQL standard
// prin protocol HTTP, perfect pentru Next.js
const connectionString = process.env.NEXT_PUBLIC_DB_CONNECTION_STRING || process.env.DATABASE_URL;

// Creăm db doar dacă connection string este disponibil (pentru server-side)
let db = null;

if (connectionString) {
  try {
    const sql = neon(connectionString);
    db = drizzleNeon(sql);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
} else {
  // În client-side, db va fi null - folosim API routes
  if (typeof window === 'undefined') {
    console.warn('DATABASE_URL or NEXT_PUBLIC_DB_CONNECTION_STRING is not set');
  }
}

export { db };
