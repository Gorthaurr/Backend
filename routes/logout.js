const { Token } = require('../models');
const logger = require('../utils/logger');

exports.logout = async (req, res) => {
    logger.request(req);
    const token = req.headers.authorization.split(' ')[1];

    try {
        logger.info('Попытка выхода пользователя', { userId: req.user.id });
        
        const result = await Token.destroy({ where: { token } });
        if (result === 0) {
            logger.warn('Токен не найден', { userId: req.user.id });
            return res.status(404).json({ message: "Токен не найден" });
        }
        
        logger.info('Токен удален', { userId: req.user.id });
        const response = { message: "Выход успешен" };
        logger.response(res, response);
        res.json(response);
    } catch (error) {
        logger.error('Ошибка при выходе', error);
        res.status(500).json({ message: "Ошибка выхода", error: error.message });
    }
};
