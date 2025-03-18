"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const companiesModel_1 = __importDefault(require("../models/companiesModel"));
const enums_1 = require("../utils/enums");
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
        field: 'type_file',
        validate: {
            notNull: { msg: 'El tipo de archivo es obligatorio' },
            isIn: {
                args: [['IVA', 'ICA', 'RTE']],
                msg: 'El tipo de archivo debe ser uno de los siguientes: IVA, ICA, RTE'
            }
        }
    },
    nameFile: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'name_file',
        validate: {
            notEmpty: { msg: 'El nombre o la ruta del archivo es obligatorio' },
            len: { args: [1, 255], msg: 'El nombre de la compañia debe tener entre 1 y 200 caracteres' },
            is: {
                args: [/^(\/uploads\/excels\/[0-9]+_(IVA|ICA|RTE).*\.(xlsx|xls))$/i],
                msg: 'El nombre del archivo debe comenzar con ICA, IVA o RTE seguido de texto, números, guiones, rayas o espacios y terminar con .xlsx',
            }
        }
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
    year: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'year'
    },
    period: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(enums_1.TypePeriod)),
        allowNull: false,
        field: 'period'
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
