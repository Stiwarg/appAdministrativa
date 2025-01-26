import createMulterUpload from '../utils/multer';
import path from 'path';

const imageUpload = createMulterUpload({
    destinationPath: path.join( process.cwd(), 'src', 'uploads', 'logos'),
    allowedMimeTypes: [ 'image/jpeg', 'image/png', 'image/jpg' ],
    maxFileSizeMB: 2
});

export default imageUpload;

