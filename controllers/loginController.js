const loginModel = require("../models/loginModel");

const renderizarFormulario = (req, res) => {
  res.render("login", { showLogin: true });
};

const autenticarUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await loginModel.verificarUsuario(email, senha);

    if (!usuario) {
      return res.render("login", { errorMessage: "Email ou senha inválidos." });
    }

    req.session.regenerate((err) => {
      if (err) {
        console.error("Erro ao iniciar a sessão:", err);
        return res.status(500).send("Erro interno ao verificar o usuário.");
      }

      req.session.loggedin = true;
      req.session.userId = usuario.id;
      res.redirect("/receitas");
    });
  } catch (err) {
    console.error("Erro ao verificar o usuário:", err);
    res.status(500).send("Erro interno ao verificar o usuário.");
  }
};

module.exports = {
  renderizarFormulario,
  autenticarUsuario,
};
