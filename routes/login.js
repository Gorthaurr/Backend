const { User, Token } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
require('dotenv').config();

exports.login = async (req, res) => {
    logger.request(req);
    const { email, password } = req.body;

    try {
        logger.info('Попытка входа пользователя', { email });
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            logger.warn('Пользователь не найден', { email });
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            logger.warn('Неверный пароль', { email });
            return res.status(401).json({ message: "Неверный пароль" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        logger.info('Токен создан', { userId: user.id });

        await Token.create({
            user_id: user.id,
            token,
            expires: new Date(Date.now() + 604800000) // 7 дней
        });
        logger.info('Токен сохранен в базе данных', { userId: user.id });

        const response = { token, user: { id: user.id, email: user.email } };
        logger.response(res, response);
        res.json(response);
    } catch (error) {
        logger.error('Ошибка при входе', error);
        res.status(500).json({ message: "Ошибка входа", error: error.message });
    }
};
