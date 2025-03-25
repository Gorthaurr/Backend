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
app.use(cors());
app.use(express.json());

app.post('/register', register.register);
app.post('/login', login.login);
app.post('/logout', auth, logout.logout);
app.post('/generateLink', auth, generateLink.generateLink);
app.post('/devices/block', auth, blockDevice.blockDevice);
app.get('/devices', auth, devices.getDevices);

app.get('/download/:file', (req, res) => {
    const path = require('path');
    res.download(path.join(__dirname, 'files', decodeURIComponent(req.params.file)));
});

app.listen(5000, () => console.log('✅ Сервер запущен на порту 5000'));
