"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = void 0;
const sequelize_1 = require("sequelize");
const env_1 = require("./env");
const sequelize = new sequelize_1.Sequelize(env_1.env.db.database, env_1.env.db.user, env_1.env.db.password, {
    host: env_1.env.db.host,
    dialect: 'mysql'
});
exports.default = sequelize;
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
exports.testConnection = testConnection;
