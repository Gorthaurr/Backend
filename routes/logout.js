const { Token } = require('../models');

exports.logout = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        await Token.destroy({ where: { token } });
        res.json({ message: "Выход успешен" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка выхода", error: error.message });
    }
};
