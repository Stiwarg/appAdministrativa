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
        field: 'name_company'
    },
    logo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'logo'
    },
    createdAt: {
        type: sequelize_1.DataTypes.TIME,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: sequelize_1.DataTypes.TIME,
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
