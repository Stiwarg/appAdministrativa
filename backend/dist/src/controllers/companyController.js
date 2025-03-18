"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managementCompaniesGet = exports.getCompanies = exports.createCompanyController = void 0;
const companyService_1 = require("../services/companyService");
const createCompanyController = async (req, res) => {
    try {
        const { nameCompany } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'El campo logo es obligatorio' });
        }
        const logoPath = `/uploads/logos/${req.file.filename}`;
        //console.log('nombre de la compañia:', nameCompany);
        const newCompany = await companyService_1.CompanyService.createCompany({ nameCompany }, logoPath);
        return res.status(201).json({ message: 'Se ha creado correctamente el registro de la compañia', newCompany });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.createCompanyController = createCompanyController;
const getCompanies = async (_req, res) => {
    try {
        const companies = await companyService_1.CompanyService.getAllCompanies();
        return res.status(200).json(companies);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.getCompanies = getCompanies;
const managementCompaniesGet = async (_req, res) => {
    try {
        return res.status(200).json({ message: 'Tienes acceso a la creación de empresas.' });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.managementCompaniesGet = managementCompaniesGet;
