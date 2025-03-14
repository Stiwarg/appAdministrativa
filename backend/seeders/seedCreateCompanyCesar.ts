import { CompanyService } from '../src/services/companyService';

const seedCompany = async (): Promise< void > => {
    try {
        const companyData = {
            nameCompany: 'Cesar Saucedo Salazar S.A.S'.toLowerCase(),
        }
        const logo = '/uploads/logos/logoCompanyCesar.jpg';
        const newCompany = await CompanyService.createCompany( companyData, logo );
        console.log('Compañia creada:', newCompany);
    } catch (error) {
        console.error('Error al crear la compañia dueña del aplicativo:', error);
    }
}

export default seedCompany;