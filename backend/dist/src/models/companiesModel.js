"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Companies extends sequelize_1.Model {
}
Companies.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    nameCompany: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'name_company',
        validate: {
            notEmpty: { msg: 'El nombre de la compañia no puede estar vacio' },
            len: { args: [1, 200], msg: 'El nombre de la compañia debe tener entre 1 y 200 caracteres' },
            is: {
                args: /^[a-zA-Z0-9Ññ]([a-zA-Z0-9Ññ\s.,'()-]*(?:[ &]+[a-zA-Z0-9Ññ\s.,'()-]+)*)?$/,
                msg: 'El nombre de la compañia contiene caracteres no permitidos'
            }
        }
    },
    logo: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: 'logo',
        validate: {
            notEmpty: {
                msg: 'El logo no puede estar vacio'
            },
            is: {
                args: [/^(\/uploads\/logos\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png))$/i],
                msg: 'El logo debe ser una ruta válida en formato JPG, JPEG, PNG o JFIF.',
            },
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
    modelName: 'Companies',
    tableName: 'companies',
    timestamps: true
});
exports.default = Companies;
