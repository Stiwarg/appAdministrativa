import createMulterUpload from '../utils/multer';
import path from 'path';
import { uploadsPath } from '../utils/constantes';

/**
 * Función para subir archivos Excel de la version xlsx y xls
 */
const excelUpload = createMulterUpload({
    destinationPath: path.join( uploadsPath, 'excels' ),
    allowedMimeTypes: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ],
    maxFileSizeMB: 5,
});

export default excelUpload;