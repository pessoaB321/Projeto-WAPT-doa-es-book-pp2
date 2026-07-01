const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Livro = sequelize.define("Livro", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
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
  // Vínculo simples com o usuário conforme solicitado
  usuarioId: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

module.exports = Livro;
