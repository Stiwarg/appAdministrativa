import { Request } from 'express';
import multer, { DiskStorageOptions, FileFilterCallback} from 'multer';
import path from 'path';
// Configuración de Multer para cargar imágenes.

/* destination: La carpeta en la que se ha guardado el archivo.
   filename: El nombre del archivo dentro de destination.
   cb: se utiliza dentro de destination para informar al sistema sobre la ubicación de destino elegida.
   mimetype: Tipo de MIME del archivo.
**/

//const uploadsPath = path.resolve( __dirname, '../../uploads/logos' );
const uploadsPath = path.join( process.cwd(),'src','uploads', 'logos');

// Configuración de almacenamiento de imágenes
const storage: DiskStorageOptions = {
    destination: ( _req: Request , _file: Express.Multer.File , cb: ( error: Error | null, destination: string ) => void ) => {
        try {
            cb( null, uploadsPath );
        } catch (error) {
            console.error("Error durante la carga:", error);
            cb( error as Error, '');
        }
    },
    filename: ( _req: Request, file: Express.Multer.File, cb: ( error: Error | null, filename: string ) => void ) => {
        try {
            const timestamp = Date.now();
            cb( null, `${ timestamp }_${ file.originalname }`) // Nombre el archivo con un timestamp único
        } catch (error) {
            console.error('Error al asignar el nombre del archivo:', error );
            cb( error as Error, '');
        }

    }
} 

// Esta función controla los achivos que quiere cargar y cuales deben omitirse
const fileFilter = ( _req: Request, file: Express.Multer.File , cb: FileFilterCallback ) => {
    const allowTypes = ['image/jpeg','image/png','image/jpg'];
    if ( allowTypes.includes( file.mimetype )) {
        console.log("Archivo recibido:", file); // Imprimir detalles del archivo
        cb(null, true); // Extensión permitida
    } else {
        cb( new Error('Formato de archivo no permitido. Solo se aceptan JPG, JPEG, PNG O JFIF'))
    }
}

const upload = multer({
    storage: multer.diskStorage( storage ),
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export default upload;