// backend/index.js
const express = require('express');
const cors = require('cors');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const logoutRoute = require('./routes/logout');
const userRoute = require('./routes/user');
const app = express();
const port = 5000;

// Миддлвар для парсинга JSON
app.use(express.json());
app.use(cors());

// Подключение маршрутов
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/user', userRoute);

// Запуск сервера
app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
});
