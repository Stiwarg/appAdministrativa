import { Request, Response } from 'express';
import { PDFDocumentServices } from '../services/pdfService';
import { IFindByNit } from '../interfaces/interface';

export const certificateController = async( req: Request, res: Response ) => {
    const { nit } : IFindByNit = req.body;

    try {
        await PDFDocumentServices.certificateGeneration( nit, res );
        
    } catch (error) {
        console.error('Error al generar el certificado:', error);
        res.status(500).send('Error al generar el certificado.');
    }
}