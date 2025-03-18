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
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
        field: 'name_rol',
        validate: {
            notEmpty: { msg: 'El nombre del rol no puede estar vacio' },
            len: { args: [1, 200], msg: 'El nombre del rol debe tener entre 1 y 200 caracteres' },
            is: {
                args: /^[a-zA-Z0-9\s_-]*$/,
                msg: 'El nombre del rol contiene caracteres no permitidos'
            }
        }
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    sequelize: database_1.default,
    modelName: 'Roles',
    tableName: 'roles',
    timestamps: true
});
exports.default = Roles;
