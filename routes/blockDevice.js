const { Device, DeviceBlockSchedule, sequelize } = require('../models');
const logger = require('../utils/logger');

exports.blockDevice = async (req, res) => {
    logger.request(req);
    const { deviceId, isBlocked } = req.body;
    const userId = req.user.id;

    try {
        // Валидация входных данных
        if (typeof deviceId !== 'number' || typeof isBlocked !== 'boolean') {
            logger.warn('Неверные параметры запроса', { deviceId, isBlocked });
            return res.status(400).json({ message: "Неверные параметры запроса" });
        }

        logger.info('Попытка изменения статуса устройства', { deviceId, isBlocked, userId });
        
        // Начинаем транзакцию
        const result = await sequelize.transaction(async (t) => {
            // Проверяем существование устройства и его принадлежность пользователю
            const device = await Device.findOne({ 
                where: { 
                    id: deviceId,
                    user_id: userId // Проверяем принадлежность пользователю
                },
                transaction: t
            });

            if (!device) {
                logger.warn('Устройство не найдено или не принадлежит пользователю', { deviceId, userId });
                throw new Error("Устройство не найдено или не принадлежит пользователю");
            }

            // Обновляем статус устройства
            await Device.update(
                { status: isBlocked },
                { 
                    where: { id: deviceId },
                    transaction: t
                }
            );

            logger.info('Статус устройства обновлен', { deviceId, isBlocked, userId });
            return { success: true };
        });

        const response = { 
            message: "Статус устройства обновлен",
            success: true
        };
        
        logger.response(res, response);
        res.json(response);
    } catch (error) {
        logger.error('Ошибка при изменении статуса устройства', error);
        res.status(500).json({ 
            message: error.message || "Ошибка изменения статуса",
            success: false
        });
    }
};
