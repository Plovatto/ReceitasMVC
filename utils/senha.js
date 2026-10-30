const crypto = require("crypto");
const { promisify } = require("util");

const scrypt = promisify(crypto.scrypt);
const TAMANHO_CHAVE = 64;

const gerarHash = async (senha) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const chave = await scrypt(senha, salt, TAMANHO_CHAVE);
  return `scrypt$${salt}$${chave.toString("hex")}`;
};

const ehHashLegado = (hash) => /^[a-f0-9]{32}$/i.test(hash);

const compararSenha = async (senha, hash) => {
  if (typeof senha !== "string" || typeof hash !== "string") return false;

  if (ehHashLegado(hash)) {
    const md5 = crypto.createHash("md5").update(senha).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(md5), Buffer.from(hash.toLowerCase()));
  }

  const [algoritmo, salt, chaveHex] = hash.split("$");
  if (algoritmo !== "scrypt" || !salt || !chaveHex) return false;

  const esperada = Buffer.from(chaveHex, "hex");
  const chave = await scrypt(senha, salt, esperada.length);
  return crypto.timingSafeEqual(chave, esperada);
};

module.exports = {
  gerarHash,
  compararSenha,
  ehHashLegado,
};
