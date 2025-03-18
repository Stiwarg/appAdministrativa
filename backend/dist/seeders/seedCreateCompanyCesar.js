"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const companyService_1 = require("../src/services/companyService");
const seedCompany = async () => {
    try {
        const companyData = {
            nameCompany: 'Cesar Saucedo Salazar S.A.S'.toLowerCase(),
        };
        const logo = '/uploads/logos/logoCompanyCesar.jpg';
        const newCompany = await companyService_1.CompanyService.createCompany(companyData, logo);
        console.log('Compañia creada:', newCompany);
    }
    catch (error) {
        console.error('Error al crear la compañia dueña del aplicativo:', error);
    }
};
exports.default = seedCompany;
