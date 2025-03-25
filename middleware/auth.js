const jwt = require('jsonwebtoken');
const { Token, User } = require('../models');
require('dotenv').config();

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Нет токена авторизации" });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Неправильный формат токена" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenExists = await Token.findOne({ where: { token, user_id: decoded.userId } });

        if (!tokenExists) return res.status(401).json({ message: "Недействительный токен" });

        req.user = await User.findByPk(decoded.userId);
        next();
    } catch (error) {
        res.status(401).json({ message: "Ошибка авторизации", error: error.message });
    }
};
