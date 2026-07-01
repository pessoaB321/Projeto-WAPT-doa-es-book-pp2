const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Administrador = sequelize.define('Administrador', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha:{
        type: DataTypes.STRING,
        allowNull: false
    },
    cargo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Administrador'
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Ativo'
    },
    foto: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Administrador;