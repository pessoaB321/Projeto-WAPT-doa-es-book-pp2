const express = require("express");
const router = express.Router();
const Livro = require("../models/Livro"); // Importa o modelo do banco

// Sincroniza o modelo com o banco de dados antes de rodar as rotas
const sequelize = require("../config/database");
sequelize.sync();

// Exibir formulário e listagem puxando do banco de dados reais
router.get("/doar", async (req, res) => {
  try {
    // Busca todos os livros cadastrados no banco
    const livrosDoBanco = await Livro.findAll({ raw: true });

    res.render("livros/doar", {
      livros: livrosDoBanco,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar os livros.");
  }
});

// Cadastrar nova doação no banco de dados Sequelize
router.post("/doar/add", async (req, res) => {
  try {
    const { titulo, autor, estadoConservacao } = req.body;

    // Cria o registro no banco real
    await Livro.create({
      titulo,
      autor,
      estadoConservacao,
      usuarioId: 1, // Vínculo estático simulando o usuário logado
    });

    res.redirect("/doar");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao cadastrar o livro.");
  }
});

module.exports = router;
