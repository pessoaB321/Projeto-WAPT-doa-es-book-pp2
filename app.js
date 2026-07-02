const express = require("express");
const { engine } = require("express-handlebars");
const sequelize = require("./config/database");
const Livro = require("./models/livro");

const app = express();

// 1. Configuração do Handlebars (Nossas telas)
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", "./views");

// 2. Configuração para receber os dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// 3. Conectar e sincronizar o Banco de Dados (Cria a tabela automaticamente)
sequelize
  .sync()
  .then(() => console.log("Banco de dados conectado e tabela criada!"))
  .catch((err) => console.error("Erro ao conectar ao banco:", err));

// ROTAS DA P4

// Rota GET: Mostra a tela do formulário para o usuário
app.get("/doar", (req, res) => {
  res.render("livro/doar");
});

// Rota POST: Recebe os dados quando o usuário clica em "Cadastrar Doação"
app.post("/doar/add", async (req, res) => {
  try {
    // Pegando os dados que vieram dos "name" dos inputs do seu HTML
    const { titulo, autor, estadoConservacao, nomeDoador } = req.body;

    await Livro.create({
      titulo: titulo,
      autor: autor,
      estadoConservacao: estadoConservacao,
      nomeDoador: nomeDoador,
    });

    // Salvando no banco de dados SQLite
    await Livro.create({
      titulo: titulo,
      autor: autor,
      estadoConservacao: estadoConservacao,
    });

    console.log(`Sucesso: Livro "${titulo}" cadastrado!`);

    // Redireciona a página de volta para o formulário (limpo)
    res.redirect("/doar");
  } catch (error) {
    console.error("Erro ao salvar o livro:", error);
    res.status(500).send("Erro interno ao cadastrar o livro.");
  }
});

// INICIANDO O SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando perfeitamente na porta ${PORT}`);
  console.log(`Para ver seu formulário, acesse: http://localhost:${PORT}/doar`);
});
