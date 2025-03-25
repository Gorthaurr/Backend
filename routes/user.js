const { User } = require('../models');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'createdAt'],
        });

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при получении данных пользователя", error: error.message });
    }
};
