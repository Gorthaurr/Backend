// backend/routes/generateLink.js
const express = require('express');
const path = require('path');
const router = express.Router();

// Генерация ссылки для скачивания exe
router.get('/', (req, res) => {
    // Путь к exe файлу
    const exeFilePath = path.join(__dirname, '..', 'files', 'setup_driver.exe'); // Убедитесь, что файл находится в папке 'files'

    // Генерация уникальной ссылки на файл (можно использовать UUID или простую строку)
    const downloadLink = `http://localhost:5000/download/${encodeURIComponent('setup_driver.exe')}`;

    res.json({ downloadLink });
});

module.exports = router;
