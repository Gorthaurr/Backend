// routes/user.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/user', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Получаем токен из заголовков

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        res.json({ user: { email: decoded.email } });
    });
});

module.exports = router;
