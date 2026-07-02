const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Livro = sequelize.define("Livro", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  autor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estadoConservacao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomeDoador: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Livro;
