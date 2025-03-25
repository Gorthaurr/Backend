const { User, Token } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "Пользователь не найден" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Неверный пароль" });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        await Token.create({
            user_id: user.id,
            token,
            expires: new Date(Date.now() + 604800000) // 7 дней
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Ошибка входа", error: error.message });
    }
};
