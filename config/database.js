const { Sequelize } = require("sequelize");

// Cria o banco de dados SQLite localmente no projeto
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

module.exports = sequelize;
