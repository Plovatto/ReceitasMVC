const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_SSL === "true" ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Erro ao conectar com o banco:", err);
    return;
  }
  console.log("Conexão com o banco de dados estabelecida.");
  connection.release();
});

module.exports = pool;
