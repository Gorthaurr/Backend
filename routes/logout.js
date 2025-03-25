// routes/logout.js
const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
    // Просто удаляем токен на клиенте
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
