"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const companiesModel_1 = __importDefault(require("../models/companiesModel"));
const sequelize_1 = require("sequelize");
class CompanyService {
    static async createCompany(data, logoPath) {
        const existingCompany = await companiesModel_1.default.findOne({ where: { nameCompany: { [sequelize_1.Op.eq]: data.nameCompany } } });
        if (existingCompany) {
            throw new Error(`Ya existe una compañia con ese nombre: ${data.nameCompany}`);
        }
        try {
            data.logo = logoPath;
            const newCompany = await companiesModel_1.default.create({
                nameCompany: data.nameCompany,
                logo: data.logo // Incluye la ruta procesada del logo.
            });
            return newCompany;
        }
        catch (error) {
            throw new Error('Error al crear la compañia:' + error);
        }
    }
    static async getAllCompanies() {
        try {
            // Consulta para traer todas las empresas
            return await companiesModel_1.default.findAll({
                attributes: ['id', 'nameCompany']
            });
        }
        catch (error) {
            throw new Error('Error al obtener las empresas: ' + error);
        }
    }
    static async getCompanyById(id) {
        try {
            const company = await companiesModel_1.default.findOne({ where: { id },
                attributes: ['id', 'nameCompany'] });
            if (!company) {
                throw new Error(`Compañia con ID ${id} no encontrado`);
            }
            return company;
        }
        catch (error) {
            throw new Error('Error al obtener el ID de la empresa: ' + error);
        }
    }
}
exports.CompanyService = CompanyService;
;
