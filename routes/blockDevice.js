const { Device, DeviceBlockSchedule } = require('../models');

exports.blockDevice = async (req, res) => {
    const { deviceId, isBlocked, blockFrom, blockTo } = req.body;

    try {
        await Device.update({ status: isBlocked }, { where: { id: deviceId } });

        if (blockFrom && blockTo) {
            await DeviceBlockSchedule.create({
                device_id: deviceId,
                block_from: blockFrom,
                block_to: blockTo
            });
        }

        res.json({ message: "Статус устройства обновлен" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка изменения статуса", error: error.message });
    }
};
