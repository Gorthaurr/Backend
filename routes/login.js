// routes/login.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // используйте модель для работы с БД
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Проверка на существование пользователя в БД
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Сравнение паролей
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Создание токена
        const token = jwt.sign({ email: user.email }, 'secret', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

module.exports = router;
