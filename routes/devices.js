const { Device } = require('../models');

exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.findAll({ where: { user_id: req.user.id } });
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: "Ошибка получения устройств", error: error.message });
    }
};
