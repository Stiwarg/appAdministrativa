"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Roles extends sequelize_1.Model {
}
Roles.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED, // Entero sin signo
        primaryKey: true,
        autoIncrement: true, // Aumenta automáticamente, útil para claves primarias
        field: 'id'
    },
    nameRol: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'nameRol'
    }
}, {
    sequelize: database_1.default,
    modelName: 'Roles',
    tableName: 'roles'
});
exports.default = Roles;
