import { createCompany } from '../src/services/companyService';

const seedCompany = async (): Promise< void > => {
    try {
        const companyData = {
            nameCompany: 'Cesar Saucedo Salazar S.A.S'.toLowerCase(),
            logo: 'captura.PNG',
        }

        const newCompany = await createCompany( companyData );
        console.log('Compañia creada:', newCompany);
    } catch (error) {
        console.error('Error al crear la compañia dueña del aplicativo:', error);
    }
}

export default seedCompany;