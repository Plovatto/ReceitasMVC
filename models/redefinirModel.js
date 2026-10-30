const pool = require("../models/bancoconfig");
const { gerarHash } = require("../utils/senha");

const VALIDADE_CODIGO_MINUTOS = 15;
const MAXIMO_TENTATIVAS = 5;

const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM usuarios WHERE email = ?";
    pool.query(query, [email], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const updateUserCode = async (email, code) => {
  await pool.promise().query(
    "UPDATE usuarios SET codigo_confirmacao = ?, codigo_expira = DATE_ADD(NOW(), INTERVAL ? MINUTE), codigo_tentativas = 0 WHERE email = ?",
    [code, VALIDADE_CODIGO_MINUTOS, email]
  );
};

const consumeUserCode = async (email, code) => {
  const [usuarios] = await pool.promise().query(
    "SELECT codigo_confirmacao FROM usuarios WHERE email = ? AND codigo_confirmacao IS NOT NULL AND codigo_expira > NOW() AND codigo_tentativas < ?",
    [email, MAXIMO_TENTATIVAS]
  );
  const usuario = usuarios[0];

  if (!usuario) return false;

  if (usuario.codigo_confirmacao !== code) {
    await pool
      .promise()
      .query(
        "UPDATE usuarios SET codigo_tentativas = codigo_tentativas + 1 WHERE email = ?",
        [email]
      );
    return false;
  }

  await clearUserCode(email);
  return true;
};

const clearUserCode = async (email) => {
  await pool.promise().query(
    "UPDATE usuarios SET codigo_confirmacao = NULL, codigo_expira = NULL, codigo_tentativas = 0 WHERE email = ?",
    [email]
  );
};

const updateUserPassword = async (email, newPassword) => {
  await pool
    .promise()
    .query("UPDATE usuarios SET senha = ? WHERE email = ?", [
      await gerarHash(newPassword),
      email,
    ]);
};

module.exports = {
  findByEmail,
  updateUserCode,
  consumeUserCode,
  updateUserPassword,
};
