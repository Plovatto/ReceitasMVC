const pool = require("../models/bancoconfig");
const { gerarHash, compararSenha, ehHashLegado } = require("../utils/senha");

const verificarUsuario = async (email, senha) => {
  const [usuarios] = await pool
    .promise()
    .query("SELECT * FROM usuarios WHERE email = ?", [email]);
  const usuario = usuarios[0];

  if (!usuario || !(await compararSenha(senha, usuario.senha))) {
    return null;
  }

  if (ehHashLegado(usuario.senha)) {
    await pool
      .promise()
      .query("UPDATE usuarios SET senha = ? WHERE id = ?", [
        await gerarHash(senha),
        usuario.id,
      ]);
  }

  return usuario;
};

module.exports = {
  verificarUsuario,
};
