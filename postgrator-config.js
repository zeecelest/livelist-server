require('dotenv').config();

module.exports = {
  migrationDirectory: 'migrations',
  driver: 'pg',
  host: process.env.MIGRATION_DB_HOST,
  port: process.env.MIGRATION_DB_PORT,
  connectionString:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL,
  database: process.env.MIGRATION_DB_NAME,
  username: process.env.MIGRATION_DB_USER,
  password: process.env.MIGRATION_DB_PASS,
  ssl: !!process.env.SSL,
};
