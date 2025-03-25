// models.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgresql://postgres:password@localhost:5432/yourdbname');

// Модель для пользователей
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = { User, sequelize };
