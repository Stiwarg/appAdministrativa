import { Request, Response } from 'express';
import { CompanyService } from '../services/companyService';
import { ICompanyName } from '../interfaces/interface';

export const createCompanyController = async ( req: Request, res: Response ) => {
    try {

        const { nameCompany } : ICompanyName = req.body;

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

export const getCompanies = async ( _req: Request, res: Response ) => {
    try {
        const companies = await CompanyService.getAllCompanies();
        return res.status( 200 ).json( companies );
    } catch (error: any ) {
        return res.status( 400 ).json({ message: error.message });
    }
}