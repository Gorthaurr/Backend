const { Device } = require('../models');
const logger = require('../utils/logger');

exports.getDevices = async (req, res) => {
    logger.request(req);
    try {
        logger.info('Получение списка устройств', { userId: req.user.id });
        
        const devices = await Device.findAll({ where: { user_id: req.user.id } });
        logger.info('Устройства получены', { count: devices.length });
        
        logger.response(res, devices);
        res.json(devices);
    } catch (error) {
        logger.error('Ошибка при получении устройств', error);
        res.status(500).json({ message: "Ошибка получения устройств", error: error.message });
    }
};
