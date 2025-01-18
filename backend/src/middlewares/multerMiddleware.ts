import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const multerErrorHandler = ( err: any, _req: Request, res: Response, next: NextFunction ): Response | void => {
    // Errores especificos de Multer
    if ( err instanceof multer.MulterError ) {
        console.log('Error de Multer:', err);  // Esto te dará más detalles
        switch ( err.code ) {
            case 'LIMIT_FILE_SIZE':
                return res.status( 400 ).json({ message: 'El archivo supera el tamaño permitido.'});
            case 'LIMIT_FILE_COUNT':
                return res.status( 400 ).json({ message: 'Excediste el número de archivos permitidos.'});
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status( 400 ).json({ message: 'El formato del archivo no es válido.'});
            default: 
                return res.status( 400 ).json({ message: 'Error en la carga del archivo.'})
        }
    }

    // Otros errores
    if ( err ) {
        return res.status( 500 ).json({ message: 'Error inesperado durante la carga de archivos.'})
    }

    // Si no hay errores, continua con el siguiente middleware
    return next();
}