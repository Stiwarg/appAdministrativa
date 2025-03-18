"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const filesExcelsModel_1 = __importDefault(require("../models/filesExcelsModel"));
const UsersModel_1 = __importDefault(require("../models/UsersModel"));
class FilesDetails extends sequelize_1.Model {
}
FilesDetails.init({
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
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'tp_rete',
        validate: {
            isInt: { msg: 'tpRete debe ser un numero entero válido' },
            notNull: { msg: 'El tp_rete es obligatorio' },
            min: { args: [0], msg: 'El tp_rete debe ser mayor o igual a 0' }
        }
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'user_id',
        references: {
            model: UsersModel_1.default,
            key: 'id'
        }
    },
    dv: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'dv',
        validate: {
            isInt: { msg: 'dv debe ser un número entero válido.' },
            notNull: { msg: 'El dv es obligatorio' },
            min: { args: [0], msg: 'El dv debe ser mayor o igual a 0' }
        }
    },
    nameCompany: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'name_company',
        validate: {
            notEmpty: { msg: 'El nombre de la compañia no puede estar vacio' },
            len: { args: [1, 200], msg: 'El nombre de la compañia debe tener entre 1 y 200 caracteres' },
            /*is: {
                args: /^[a-zA-Z0-9\s._-]*$/,
                msg:'El nombre de la compañia contiene caracteres no permitidos'
            }*/
        }
    },
    nameConcept: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'name_concept',
        validate: {
            notEmpty: { msg: 'El nombre de la compañia no puede estar vacio' },
            len: { args: [1, 200], msg: 'El nombre de la compañia debe tener entre 1 y 200 caracteres' },
            /*is: {
                args: /^[a-zA-Z0-9\s,._;:'"\-!()&*$@#^=+]*$/,
                msg:'El nombre de la compañia contiene caracteres no permitidos'
            }*/
        }
    },
    base: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'base',
        validate: {
            isInt: { msg: 'La base debe ser un número entero válido' },
            notNull: { msg: 'La base es obligatoria' },
            min: { args: [0], msg: 'La base debe ser mayor o igual a 0' },
            max: { args: [9999999999999999999999999999], msg: 'La base debe ser un número razonable y no exceder el límite de 30 dígitos' }
        }
    },
    valueRetained: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'value_retained',
        validate: {
            isInt: { msg: 'El valor retenido debe ser un número entero válido' },
            notNull: { msg: 'El valor retenido es obligatorio' },
            min: { args: [0], msg: 'La base debe ser mayor o igual a 0' },
            max: { args: [9999999999999999999999999999], msg: 'La base debe ser un número razonable y no exceder el límite de 30 dígitos' }
        }
    },
    percentage: {
        type: sequelize_1.DataTypes.DECIMAL(7, 3),
        allowNull: false,
        field: 'percentage',
        validate: {
            isDecimal: { msg: 'El porcentaje debe ser un número decimal válido' },
            notNull: { msg: 'El porcentaje es obligatorio' },
            min: { args: [0], msg: 'El porcentaje debe ser mayor o igual a 0' },
            max: { args: [100], msg: 'El porcentaje no puede ser mayor que 100' },
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
    modelName: 'FileDetails',
    tableName: 'fileDetails',
    timestamps: true
});
exports.default = FilesDetails;
