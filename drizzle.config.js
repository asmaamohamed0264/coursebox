/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./configs/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DB_CONNECTION_STRING || 'postgresql://coursebox_user:change_me_secure_password@localhost:5432/coursebox_db',
    }
  };