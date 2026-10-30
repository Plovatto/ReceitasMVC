const pool = require("../models/bancoconfig");
const { gerarHash } = require("../utils/senha");

const criarNovoUsuarioNoBanco = async (
  nome,
  sobrenome,
  email,
  senha,
  dataNascimento,
  callback
) => {
  try {
    const hashedSenha = await gerarHash(senha);
    const [result] = await pool
      .promise()
      .query(
        "INSERT INTO usuarios (nome, sobrenome, email, senha, data_nascimento) VALUES (?, ?, ?, ?, ?)",
        [nome, sobrenome, email, hashedSenha, dataNascimento]
      );

    callback(null, result.insertId);
  } catch (err) {
    console.error("Erro ao cadastrar o usuário:", err);
    callback(err, null);
  }
};

const buscarUsuarioPorEmail = (email, callback) => {
  pool.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Erro ao buscar o usuário:", err);
        return callback(err, null);
      }

      if (results.length === 0) {
        return callback(null, null);
      }

      const usuario = results[0];
      callback(null, usuario);
    }
  );
};

module.exports = {
  criarNovoUsuarioNoBanco,
  buscarUsuarioPorEmail,
};
