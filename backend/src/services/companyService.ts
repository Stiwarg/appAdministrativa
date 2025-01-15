import Companies from "../models/companiesModel";
import { TCompanyFromSchema } from "../schemas/companySchema";
import { TNewCompany } from "../types/type";
import { Op } from 'sequelize';

export const createCompany = async ( data: TCompanyFromSchema ): Promise< TNewCompany > => {

    const existingCompany = await Companies.findOne({ where: { nameCompany: { [ Op.gt ]: data.nameCompany} } });

    if ( existingCompany ) {
        throw new Error(`Ya existe una compañia con ese nombre: ${ data.nameCompany }`);
    }

    try {
        const newCompany = await Companies.create( data );
        return newCompany;
    } catch (error) {
        throw new Error('Error al crear la compañia:' + error );
    }
}