"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const companiesModel_1 = __importDefault(require("../src/models/companiesModel"));
const rolesModel_1 = __importDefault(require("../src/models/rolesModel"));
const userService_1 = require("../src/services/userService");
// Primero se busca el rol 'Administrador'
// hasheamos la contraseña
// creamos el usuario administrador si no existe
const seedAdminUser = async () => {
    try {
        const admin = 'administrador';
        const adminRole = await rolesModel_1.default.findOne({ where: { nameRol: admin.toLowerCase() } });
        const nameCompanyOwnsApplication = 'Cesar Saucedo Salazar S.A.S';
        const companyOwns = await companiesModel_1.default.findOne({ where: { nameCompany: nameCompanyOwnsApplication } });
        if (adminRole && companyOwns) {
            const adminData = {
                nit: 11010101,
                password: 'CesarPopular2025',
                rolId: adminRole.id,
                companyId: companyOwns.id
            };
            const employeData = {
                nit: 110101021,
                password: 'josePedrogal123',
                companyId: companyOwns.id
            };
            const newAdminUser = await userService_1.UserService.createUser(adminData);
            //console.log('Usuario administrador:', newAdminUser);
            const newEmployeUser = await userService_1.UserService.createEmployee(employeData);
            console.log('Usuario administrador creado:', newAdminUser);
            console.log('Usuario empleado creado:', newEmployeUser);
        }
        else {
            console.log('Rol administrador no encontrado.');
        }
    }
    catch (error) {
        console.error('Error al crear el usuario administrador:', error);
    }
};
exports.default = seedAdminUser;
