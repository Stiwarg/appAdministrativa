"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rolesModel_1 = __importDefault(require("../src/models/rolesModel"));
const seedRoles = async () => {
    try {
        const roles = ['Administrador', 'Empleado'];
        await Promise.all(roles.map(async (roleName) => {
            const [_, created] = await rolesModel_1.default.findOrCreate({
                where: { nameRol: roleName.trim().toLowerCase() },
                defaults: { nameRol: roleName.trim().toLowerCase() },
            });
            if (!created) {
                console.log(`Role '${roleName}' ya existia.`);
            }
        }));
        console.log('Roles creados correctamente');
    }
    catch (error) {
        console.error('Error l crear los roles:', error);
    }
};
exports.default = seedRoles;
