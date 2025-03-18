import { Request, Response } from 'express';
import { PDFDocumentServices } from '../services/pdfService';
import { ICertificateRequest } from '../interfaces/interface';
import { NotFoundError } from '../utils/errors';

export const certificateController = async( req: Request, res: Response ) => {
    try {
        let { nit, year, typeFile, period } : ICertificateRequest = req.body;
        const user = req.user;

        if ( user && user.rolId === 2 ) {
            nit = user.nit;
        }

        if ( !nit ) {
            return res.status( 403 ).json({ message: "Acceso denegado" })
        }

        await PDFDocumentServices.certificateGeneration( nit, year, typeFile, period , res );
        return;
    } catch (error) {
        if ( error instanceof NotFoundError ) {
            return res.status( 404 ).json({ message: error.message });
        }
        console.error('Error al generar el certificado:', error);
        return res.status(500).send('Error al generar el certificado.');
    }
}

export const getOptionsCertificate = async ( _req: Request, res: Response ) => {
    try {
        const options = await PDFDocumentServices.generateOptionsCertificate();
        return res.json( options );
    } catch (error) {
        console.error('Error al obtener las opciones de certificado:', error );
        return res.status( 500 ).send('Error al obtener las opciones de certificado.');
    }
}

export const searchUserDetails = async (req: Request, res: Response) => {
    try {
        let { nit, year, typeFile, period } : ICertificateRequest = req.body;
        const user = req.user;

        if ( user && user.rolId === 2 ) {
            nit = user.nit;
        }

        if ( !nit ) {
            return res.status( 403 ).json({ message: "Acceso denegado" });
        }

        const { message, certificateFound } = await PDFDocumentServices.getUserCertificateDetails( nit, year, typeFile, period );
        return res.status(200).json({ 
            message,
            certificateFound 
        });
    } catch (error) {
        if ( error instanceof NotFoundError ) {
            return res.status( 404 ).json({ message: error.message });
        }
        console.error("Error al buscar detalles del usuario:", error );
        return res.status( 500 ).send('Error al buscar detalles del usuario.');
    }
}
