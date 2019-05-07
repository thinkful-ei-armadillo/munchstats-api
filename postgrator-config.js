'use strict';

require('dotenv').config();

module.exports = {
  'migrationDirectory': 'migrations',
  'driver': 'pg',
  'host': process.env.MIGRATION_DB_HOST || 'localhost',
  'port': process.env.MIGRATION_DB_PORT || '5432',
  'database': process.env.MIGRATION_DB_NAME || 'munchstats-test',
  'username': process.env.MIGRATION_DB_USER || 'postgres',
  'password': process.env.MIGRATION_DB_PASS
};
