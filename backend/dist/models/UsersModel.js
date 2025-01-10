"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const companiesModel_1 = __importDefault(require("../models/companiesModel"));
const rolesModel_1 = __importDefault(require("../models/rolesModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class Users extends sequelize_1.Model {
    // Método estático para autenticar un usuario 
    static async authenticate(nit, password) {
        const user = await Users.findOne({ where: { nit } });
        if (user && await bcrypt_1.default.compare(password, user.password)) {
            return user;
        }
        return null;
    }
    static async findByNit(nit) {
        return await Users.findOne({ where: { nit } });
    }
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
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'password',
        validate: {
            len: [8, 100]
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
    }
}, {
    sequelize: database_1.default,
    modelName: 'Users',
    tableName: 'users',
    timestamps: true // Controla 'CreatedAt' 
});
// Hash automático de contraseñas antes de guardar 
Users.beforeCreate(async (user) => {
    if (user.password) {
        user.password = await bcrypt_1.default.hash(user.password, 10);
    }
});
Users.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
};
exports.default = Users;
