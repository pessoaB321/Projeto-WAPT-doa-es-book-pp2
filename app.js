const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const livrosRotas = require("./routes/livrosrotas");

const app = express();

// Configuração do Handlebars sem exigir layout padrão
app.engine("handlebars", engine({ defaultLayout: false }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para ler dados de formulários (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos (CSS) se houver
app.use(express.static(path.join(__dirname, "public")));

// Rota inicial redireciona para a página de doação
app.get("/", (req, res) => {
  res.redirect("/livros/doar");
});

// Usar as rotas de livros
app.use("/livros", livrosRotas);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
app.use(express.static("public"));
