require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres", // Your PostgreSQL username
  host: "localhost",
  database: "myapp", // Database created on Day 1
  password: process.env.DB_PASSWORD, // Replace with your PostgreSQL password
  port: 5432,
});

module.exports = pool;
