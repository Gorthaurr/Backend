const express = require('express');
const cors = require('cors');
require('dotenv').config();

const auth = require('./middleware/auth');
const register = require('./routes/register');
const login = require('./routes/login');
const logout = require('./routes/logout');
const generateLink = require('./routes/generateLink');
const blockDevice = require('./routes/blockDevice');
const devices = require('./routes/devices');

const app = express();

// Настройка CORS
app.use(cors({
    origin: '*', // Разрешаем все источники
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400 // 24 часа
}));

app.use(express.json());

// Логирование всех запросов
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Query:', JSON.stringify(req.query, null, 2));
    console.log('Params:', JSON.stringify(req.params, null, 2));
    next();
});

app.post('/register', register.register);
app.post('/login', login.login);
app.post('/logout', auth, logout.logout);
app.post('/generate-link', auth, generateLink.generateLink);
app.post('/devices/block', auth, blockDevice.blockDevice);

// Важно: сначала определяем маршрут с параметром
app.get('/devices/:id', auth, devices.getDeviceById);
// Затем определяем общий маршрут
app.get('/devices', auth, devices.getDevices);

app.get('/download/:file', (req, res) => {
    const path = require('path');
    res.download(path.join(__dirname, 'files', decodeURIComponent(req.params.file)));
});

// Обработка ошибок
app.use((err, req, res, next) => {
    if (err.name === 'CORSError') {
        console.error('CORS Error:', err);
        return res.status(403).json({ message: 'CORS Error', error: err.message });
    }
    console.error('Error:', err);
    res.status(500).json({ message: 'Внутренняя ошибка сервера', error: err.message });
});

app.listen(5000, () => console.log('✅ Сервер запущен на порту 5000'));
