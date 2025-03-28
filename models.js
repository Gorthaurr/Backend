const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
    }
);

const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
});

const Device = sequelize.define('Device', {
    name: { type: DataTypes.STRING, allowNull: false },
    status: { 
        type: DataTypes.ENUM('true', 'false'),
        defaultValue: 'false',
        get() {
            return this.getDataValue('status') === 'true';
        },
        set(value) {
            this.setDataValue('status', value ? 'true' : 'false');
        }
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false }
});

const Token = sequelize.define('Token', {
    token: { type: DataTypes.STRING(500), unique: true },
    expires: { type: DataTypes.DATE },
});

const DeviceBlockSchedule = sequelize.define('DeviceBlockSchedule', {
    block_from: { type: DataTypes.TIME, allowNull: false },
    block_to: { type: DataTypes.TIME, allowNull: false },
});

User.hasMany(Device, { foreignKey: 'user_id' });
Device.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Token, { foreignKey: 'user_id' });
Token.belongsTo(User, { foreignKey: 'user_id' });

Device.hasMany(DeviceBlockSchedule, { foreignKey: 'device_id' });
DeviceBlockSchedule.belongsTo(Device, { foreignKey: 'device_id' });

sequelize.sync({ alter: true }).then(() => {
    console.log('База данных синхронизирована');
}).catch(error => {
    console.error('Ошибка синхронизации базы данных:', error);
});

module.exports = { sequelize, User, Device, Token, DeviceBlockSchedule };
