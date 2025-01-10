"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const companiesModel_1 = __importDefault(require("../models/companiesModel"));
class FilesExcels extends sequelize_1.Model {
}
FilesExcels.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    typeFile: {
        type: sequelize_1.DataTypes.ENUM,
        values: ['IVA', 'ICA', 'RTE'],
        allowNull: false,
        field: 'type_file'
    },
    nameFile: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    empresaId: {
        type: sequelize_1.DataTypes.INTEGER,
        field: 'empresa_id',
        references: {
            model: companiesModel_1.default,
            key: 'id'
        },
        allowNull: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.TIME,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'created_at', // Nombre real en la tabla
    },
    updatedAt: {
        type: sequelize_1.DataTypes.TIME,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    sequelize: database_1.default,
    modelName: 'FilesExcels',
    tableName: 'filesExcels',
    timestamps: true
});
exports.default = FilesExcels;
