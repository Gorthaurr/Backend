// backend/routes/register.js
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            token,
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка регистрации' });
    }
};
