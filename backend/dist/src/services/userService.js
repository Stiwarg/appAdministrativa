"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UsersModel_1 = __importDefault(require("../models/UsersModel"));
const companiesModel_1 = __importDefault(require("../models/companiesModel"));
const env_1 = require("../config/env");
// Aqui se escribe la logica relacionada a la funcionalidad del modelo osea del negocio
class UserService {
    static async hashPasswordBeforeCreate(data) {
        console.log('holaaaaa:', data.password);
        if (data.password) {
            data.password = await bcrypt_1.default.hash(data.password, 10);
            console.log('cc:', data.password);
        }
        return data;
    }
    static async createUser(data) {
        const existingUser = await UsersModel_1.default.findOne({ where: { nit: data.nit } });
        if (existingUser) {
            throw new Error(`Ya existe un usuario con el NIT: ${data.nit}`);
        }
        const hashedData = await UserService.hashPasswordBeforeCreate(data);
        console.log('c:', hashedData);
        try {
            const newUser = await UsersModel_1.default.create(hashedData);
            return newUser;
        }
        catch (error) {
            throw new Error('Error a crear al usuario:' + error);
        }
    }
    static async createEmployee(data) {
        const dataWithRole = { ...data, rolId: 2 };
        return await UserService.createUser(dataWithRole);
    }
    static async findByNit(nit) {
        try {
            console.log('Empezar hacer la busqueda');
            const user = await UsersModel_1.default.findOne({
                where: { nit: nit },
                attributes: ['id', 'nit', 'companyId', 'rolId']
            });
            /*if ( !user ) {
                console.log(`Usuario con NIT ${ nit } no encontrado`);
                throw new Error(`Usuario con NIT ${ nit } no encontrado.`)
            }*/
            return user;
        }
        catch (error) {
            throw new Error('Error al buscar el usuario: ' + error);
        }
    }
    static async findOrCreateEmployeeBy(nit, companyId) {
        try {
            // Intentar encontrar el usuario por NIT
            let user = await UserService.findByNit(nit);
            console.log('Estos son los usuarios que se buscan: ', user);
            // Si el usuario no existe, crearlo
            if (!user) {
                const newUser = await UserService.createEmployee({
                    nit,
                    password: nit.toString(),
                    companyId: companyId
                });
                //console.log(`Estos son los usuarios nuevos que se crearon con el nit ${ nit }: `, newUser);
                return newUser; // Se retorna el nuevo usuario
            }
            return user; // Se retorna el usuairo encontrado.
        }
        catch (error) {
            throw new Error('Error en la búsqueda o creación del usuario: ' + error);
        }
    }
    static async findOrCreateEmployeeBy3(nit, companyId) {
        try {
            const [user, created] = await UsersModel_1.default.findOrCreate({
                where: { nit },
                defaults: {
                    nit,
                    password: nit.toString(),
                    companyId,
                    rolId: 2,
                },
                attributes: ['id', 'nit', 'companyId', 'rolId'],
            });
            if (created) {
                console.log(`Usuario con NIT ${nit} creado`);
            }
            else {
                console.log(`Usuario con NIT ${nit} ya existe`);
            }
            return user;
        }
        catch (error) {
            throw new Error('Error en la búsqueda o creación del usuario: ' + error);
        }
    }
    static async updatePassword(nit, hashedPassword) {
        try {
            console.log("dentra a la funcion");
            console.log('Contraseña: ', hashedPassword);
            const [rowsUpdated] = await UsersModel_1.default.update({
                password: hashedPassword
            }, { where: { nit } });
            console.log("pasa la consulta?");
            if (rowsUpdated === 0) {
                console.log(`No se pudo actualizar la contraseña para el usuario con NIT ${nit}.`);
                throw new Error(`No se pudo actualizar la contraseña para el usuario con NIT ${nit}.`);
            }
            console.log(`Contraseña actualizada correctamente para el usuario con NIT ${nit}.`);
        }
        catch (error) {
            throw new Error('Error al actualizar la contraseña: ' + error);
        }
    }
    static async getUserCompany(nit) {
        try {
            const result = await UsersModel_1.default.findOne({
                attributes: ['nit'],
                where: { nit: nit },
                include: [{
                        model: companiesModel_1.default,
                        attributes: ['logo', 'name_company'],
                    }],
            });
            console.log('[getUserCompany] Resultado de la consulta:', result);
            if (!result) {
                console.log('[getUserCompany] No se encontró ningún usuario con el NIT:', nit);
                return null;
            }
            ;
            const userCompany = result.get({ plain: true });
            //return userCompany;
            console.log('[getUserCompany] Resultado de la consulta (objeto plano):', userCompany);
            console.log('Nombre de la empresa:', userCompany.Company?.name_company);
            console.log('URL final del logo:', `${env_1.env.backendUrl}${userCompany.Company?.logo}`);
            return {
                data: {
                    nit: userCompany.nit,
                    nameCompany: userCompany.Company?.name_company ?? '',
                    logo: `${env_1.env.backendUrl}${userCompany.Company?.logo ?? ''}`
                }
            };
        }
        catch (error) {
            throw new Error('Error fetching data: ' + error);
        }
    }
}
exports.UserService = UserService;
