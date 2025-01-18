import Companies from "../models/companiesModel";
import { TCompanyFromSchema } from "../schemas/companySchema";
import { TNewCompany } from "../types/type";
import { Op } from 'sequelize';


export class CompanyService {
    static async createCompany( data: TCompanyFromSchema, logoPath: string): Promise< TNewCompany > {

        const existingCompany = await Companies.findOne({ where: { nameCompany: { [ Op.eq ]: data.nameCompany} } });

        if ( existingCompany ) {
            throw new Error(`Ya existe una compañia con ese nombre: ${ data.nameCompany }`);
        }

        try {
            data.logo = logoPath;
            const newCompany = await Companies.create({ 
                nameCompany: data.nameCompany,
                logo: data.logo // Incluye la ruta procesada del logo.
            });

            return newCompany;
        } catch (error) {
            throw new Error('Error al crear la compañia:' + error );
        }

        }
};
