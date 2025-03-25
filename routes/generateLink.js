const { Device } = require('../models');

exports.generateLink = async (req, res) => {
    const { deviceName } = req.body;

    try {
        const device = await Device.create({ name: deviceName, user_id: req.user.id });

        const file = encodeURIComponent("setup_driver.exe");
        const url = `${req.protocol}://${req.get('host')}/download/${file}`;

        res.json({ url, deviceId: device.id });
    } catch (error) {
        res.status(500).json({ message: "Ошибка генерации ссылки", error: error.message });
    }
};
