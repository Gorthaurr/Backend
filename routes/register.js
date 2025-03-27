// backend/routes/register.js
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
    logger.request(req);
    const { email, password } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        logger.info('Попытка регистрации нового пользователя', { email });
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            logger.warn('Пользователь уже существует', { email });
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        logger.debug('Пароль захеширован');

        const user = await User.create({ email, password: hashedPassword });
        logger.info('Пользователь создан', { userId: user.id, email: user.email });

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        logger.info('Токен создан', { userId: user.id });

        const response = {
            token,
            user: { id: user.id, email: user.email },
        };
        logger.response(res, response);
        res.status(201).json(response);
    } catch (error) {
        logger.error('Ошибка при регистрации', error);
        res.status(500).json({ error: 'Ошибка регистрации', details: error.message });
    }
};
