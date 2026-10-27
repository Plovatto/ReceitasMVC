const mysql = require("mysql");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
