const { Device } = require('../models');
const logger = require('../utils/logger');

exports.generateLink = async (req, res) => {
    logger.request(req);
    const { deviceName } = req.body;

    try {
        logger.info('Попытка генерации ссылки', { deviceName, userId: req.user.id });
        
        const device = await Device.create({ name: deviceName, user_id: req.user.id });
        logger.info('Устройство создано', { deviceId: device.id, deviceName });

        const file = encodeURIComponent("setup_driver.exe");
        const link = `${req.protocol}://${req.get('host')}/download/${file}`;
        logger.info('Ссылка сгенерирована', { link });

        const response = { link, deviceId: device.id };
        logger.response(res, response);
        res.json(response);
    } catch (error) {
        logger.error('Ошибка при генерации ссылки', error);
        res.status(500).json({ message: "Ошибка генерации ссылки", error: error.message });
    }
};
