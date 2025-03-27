const { User } = require('../models');
const logger = require('../utils/logger');

exports.getUser = async (req, res) => {
    logger.request(req);
    try {
        logger.info('Получение данных пользователя', { userId: req.user.id });
        
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'createdAt'],
        });

        if (!user) {
            logger.warn('Пользователь не найден', { userId: req.user.id });
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        logger.info('Данные пользователя получены', { userId: user.id });
        const response = { user };
        logger.response(res, response);
        res.json(response);
    } catch (error) {
        logger.error('Ошибка при получении данных пользователя', error);
        res.status(500).json({ message: "Ошибка при получении данных пользователя", error: error.message });
    }
};
