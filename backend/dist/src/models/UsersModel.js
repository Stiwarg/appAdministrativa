"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const companiesModel_1 = __importDefault(require("../models/companiesModel"));
const rolesModel_1 = __importDefault(require("../models/rolesModel"));
//import bcrypt from 'bcrypt';
//import { TNewUser } from '../types/type';
class Users extends sequelize_1.Model {
}
Users.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: 'id'
    },
    nit: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'nit',
        unique: true,
        validate: {
            isInt: true,
            notNull: { msg: 'El NIT es obligatorio' },
            min: { args: [100000], msg: 'El NIT debe ser mayor o igual a 100000' }
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: 'password',
        validate: {
            len: {
                args: [8, 255],
                msg: 'La contraseña debe tener entre 8 y 100 carecteres.'
            }
        }
    },
    companyId: {
        type: sequelize_1.DataTypes.INTEGER,
        field: 'company_id',
        references: {
            model: companiesModel_1.default,
            key: 'id',
        },
        allowNull: false,
    },
    rolId: {
        type: sequelize_1.DataTypes.INTEGER,
        field: 'rol_id',
        references: {
            model: rolesModel_1.default,
            key: 'id'
        },
        allowNull: false
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
    modelName: 'Users',
    tableName: 'users',
    timestamps: true // Controla 'CreatedAt' 
});
// Hook: Hash automático de contraseñas antes de guardar 
/*Users.beforeCreate( async ( user ) => {
    if ( user.password ) {
        user.password = await bcrypt.hash( user.password, 10 );
    }
});*/
Users.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
};
exports.default = Users;
