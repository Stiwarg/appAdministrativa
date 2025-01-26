import { Request } from 'express';
import multer, { DiskStorageOptions, FileFilterCallback, Multer } from 'multer';
import { IMulterConfigOptions } from '../interfaces/interface';

/**
 * Función generica para crear que permite personalizar aspectos especificos como la ruta de destino, los filtros de archivo y los limites de tamaño.
 */

const createMulterUpload = ( options: IMulterConfigOptions ): Multer => {

    // Configuración de almacenamiento de imágenes
    const storage: DiskStorageOptions = {
        destination: ( _req: Request, _file: Express.Multer.File, cb: ( error: Error | null, destination: string ) => void ) => {
            try {
                cb( null, options.destinationPath );
            } catch (error) {
                console.error('Error durante la carga:', error );
                cb( error as Error, '' );
            }
        },
        filename: ( _req: Request, file: Express.Multer.File, cb: ( error: Error | null, filename: string ) => void ) => {
            try {
                const timestamp = Date.now();
                cb( null, `${ timestamp }_${ file.originalname }`)
            } catch (error) {
                cb( error as Error, '' );
            }
        },
    };

    // Esta función controla los achivos que quiere cargar y cuales deben omitirse
    const fileFilter = ( _req: Request, file: Express.Multer.File, cb:FileFilterCallback ) => {
        if ( options.allowedMimeTypes.includes( file.mimetype )) {
            console.log('Archivo recibido:', file ); // Imprimir detalles del archivo
            cb( null, true ); // Extensión permitida 
        } else {
            cb( new Error(`Formato de archivo no permitido. Solo se aceptan: ${ options.allowedMimeTypes.join()}`));
        }
    };
    
    return multer({
        storage: multer.diskStorage( storage ),
        fileFilter,
        limits: { fileSize: options.maxFileSizeMB * 1024 * 1024 },
    });
};

export default createMulterUpload; 