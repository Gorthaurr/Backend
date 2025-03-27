const jwt = require('jsonwebtoken');
const { Token, User } = require('../models');
const logger = require('../utils/logger');
require('dotenv').config();

module.exports = async (req, res, next) => {
    logger.request(req);
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        logger.warn('Отсутствует заголовок авторизации');
        return res.status(401).json({ message: "Нет токена авторизации" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        logger.warn('Неправильный формат токена');
        return res.status(401).json({ message: "Неправильный формат токена" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.info('Токен декодирован', { userId: decoded.userId });

        const tokenExists = await Token.findOne({ where: { token, user_id: decoded.userId } });
        if (!tokenExists) {
            logger.warn('Токен не найден в базе данных', { userId: decoded.userId });
            return res.status(401).json({ message: "Недействительный токен" });
        }

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            logger.warn('Пользователь не найден', { userId: decoded.userId });
            return res.status(401).json({ message: "Пользователь не найден" });
        }

        logger.info('Пользователь найден', { userId: user.id, email: user.email });
        req.user = user;
        next();
    } catch (error) {
        logger.error('Ошибка авторизации', error);
        res.status(401).json({ message: "Ошибка авторизации", error: error.message });
    }
};
