"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const companiesModel_1 = __importDefault(require("../models/companiesModel"));
const UsersModel_1 = __importDefault(require("../models/UsersModel"));
class Certificates extends sequelize_1.Model {
}
Certificates.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: 'id'
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        field: 'user_id',
        references: {
            model: UsersModel_1.default,
            key: 'id'
        },
        allowNull: false
    },
    companyId: {
        type: sequelize_1.DataTypes.INTEGER,
        field: 'company_id',
        references: {
            model: companiesModel_1.default,
            key: 'id'
        },
        allowNull: false,
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
    archivoPdf: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'archivo_pdf',
        validate: {
            notEmpty: { msg: 'El nombre o la ruta del archivo PDF es obligatorio' },
            is: {
                args: /^[a-zA-Z0-9_\-\/\.]+\.pdf$/,
                msg: 'El archivo debe ser un PDF válido y terminar con ".pdf"'
            },
            len: {
                args: [3, 255],
                msg: 'El nombre o la ruta del archivo debe tener entre 3 y 255 caracteres'
            }
        }
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
    modelName: 'Certificates',
    tableName: 'certificates',
    timestamps: true
});
exports.default = Certificates;
