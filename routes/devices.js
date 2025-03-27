const { Device } = require('../models');
const logger = require('../utils/logger');

exports.getDevices = async (req, res) => {
    logger.request(req);
    try {
        logger.info('Получение списка устройств', { userId: req.user.id });
        
        const devices = await Device.findAll({ 
            where: { user_id: req.user.id },
            logging: console.log
        });
        
        console.log('Полученные устройства:', JSON.stringify(devices, null, 2));
        logger.info('Устройства получены', { 
            count: devices.length,
            devices: devices.map(d => ({ id: d.id, name: d.name, status: d.status }))
        });
        
        logger.response(res, devices);
        res.json(devices);
    } catch (error) {
        logger.error('Ошибка при получении устройств', error);
        res.status(500).json({ message: "Ошибка получения устройств", error: error.message });
    }
};

exports.getDeviceById = async (req, res) => {
    logger.request(req);
    const { id } = req.params;

    try {
        logger.info('Получение устройства по ID', { deviceId: id, userId: req.user.id });
        
        const device = await Device.findOne({ 
            where: { 
                id,
                user_id: req.user.id // Проверяем, что устройство принадлежит пользователю
            }
        });

        if (!device) {
            logger.warn('Устройство не найдено', { deviceId: id });
            return res.status(404).json({ message: "Устройство не найдено" });
        }

        logger.info('Устройство получено', { deviceId: device.id });
        logger.response(res, device);
        res.json(device);
    } catch (error) {
        logger.error('Ошибка при получении устройства', error);
        res.status(500).json({ message: "Ошибка получения устройства", error: error.message });
    }
};
