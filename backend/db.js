const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: "admin",
  password: "admin",
  database: "tododb",
  port: 5432
});

module.exports = pool;
