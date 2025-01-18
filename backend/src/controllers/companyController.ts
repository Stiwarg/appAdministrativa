import { Request, Response } from 'express';
import { CompanyService } from '../services/companyService';

export const createCompanyController = async ( req: Request, res: Response ) => {
    try {

        const { nameCompany } = req.body;

        if (!req.file) {
            return res.status( 400 ).json({ message: 'El campo logo es obligatorio'});
        }

        const logoPath = `/uploads/logos/${ req.file.filename }`;
        console.log('nombre de la compañia:', nameCompany);
        const newCompany = await CompanyService.createCompany( { nameCompany }, logoPath);
        return res.status(201).json({ message: 'Se ha creado correctamente el registro de la compañia', newCompany })
    } catch (error : any ) {
        return res.status( 400 ).json({ message: error.message });
    }
}