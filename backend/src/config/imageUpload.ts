import createMulterUpload from '../utils/multer';
import path from 'path';
import { uploadsPath } from '../utils/constantes';

const imageUpload = createMulterUpload({
    destinationPath: path.join( uploadsPath, 'logos' ),
    allowedMimeTypes: [ 'image/jpeg', 'image/png', 'image/jpg' ],
    maxFileSizeMB: 2
});

export default imageUpload;