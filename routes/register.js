// routes/register.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // используйте модель для работы с БД
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Сохраняем пользователя в базе данных
        const user = await User.create({
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
});

module.exports = router;
