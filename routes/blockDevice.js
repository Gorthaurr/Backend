const { Device, DeviceBlockSchedule } = require('../models');
const logger = require('../utils/logger');

exports.blockDevice = async (req, res) => {
    logger.request(req);
    const { deviceId, isBlocked, blockFrom, blockTo } = req.body;

    try {
        logger.info('Попытка изменения статуса устройства', { deviceId, isBlocked });
        
        const device = await Device.findOne({ where: { id: deviceId } });
        if (!device) {
            logger.warn('Устройство не найдено', { deviceId });
            return res.status(404).json({ message: "Устройство не найдено" });
        }

        await Device.update({ status: isBlocked }, { where: { id: deviceId } });
        logger.info('Статус устройства обновлен', { deviceId, isBlocked });

        if (blockFrom && blockTo) {
            logger.info('Создание расписания блокировки', { deviceId, blockFrom, blockTo });
            await DeviceBlockSchedule.create({
                device_id: deviceId,
                block_from: blockFrom,
                block_to: blockTo
            });
            logger.info('Расписание блокировки создано', { deviceId });
        }

        const response = { message: "Статус устройства обновлен" };
        logger.response(res, response);
        res.json(response);
    } catch (error) {
        logger.error('Ошибка при изменении статуса устройства', error);
        res.status(500).json({ message: "Ошибка изменения статуса", error: error.message });
    }
};
