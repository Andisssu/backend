const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
  connectionString: process.env.PG_URL, // Supondo que sua variável de ambiente seja PG_URL
});

module.exports = pool;
