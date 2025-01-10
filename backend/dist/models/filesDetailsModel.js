"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const filesExcelsModel_1 = __importDefault(require("../models/filesExcelsModel"));
class FileDetails extends sequelize_1.Model {
}
FileDetails.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: 'id'
    },
    filesExcelsId: {
        type: sequelize_1.DataTypes.INTEGER,
        field: 'filesExcels_id',
        references: {
            model: filesExcelsModel_1.default,
            key: 'id'
        },
        allowNull: false
    },
    tpRete: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'tp_rete'
    },
    nitRegister: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'nit_register'
    },
    dv: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'dv'
    },
    nameCompany: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'name_company'
    },
    nameConcept: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'name_concept'
    },
    base: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'base'
    },
    valueRetained: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'value_retained'
    },
    percentage: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'percentage'
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
    modelName: 'FileDetails',
    tableName: 'fileDetails',
    timestamps: true
});
exports.default = FileDetails;
