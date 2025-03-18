"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configuración de Multer para cargar imágenes.
/* destination: La carpeta en la que se ha guardado el archivo.
   filename: El nombre del archivo dentro de destination.
   cb: se utiliza dentro de destination para informar al sistema sobre la ubicación de destino elegida.
   mimetype: Tipo de MIME del archivo.
**/
//const uploadsPath = path.resolve( __dirname, '../../uploads/logos' );
const uploadsPath = path_1.default.join(process.cwd(), 'src', 'uploads', 'logos');
// Configuración de almacenamiento de imágenes
const storage = {
    destination: (_req, _file, cb) => {
        try {
            cb(null, uploadsPath);
        }
        catch (error) {
            console.error("Error durante la carga:", error);
            cb(error, '');
        }
    },
    filename: (_req, file, cb) => {
        try {
            const timestamp = Date.now();
            cb(null, `${timestamp}_${file.originalname}`); // Nombre el archivo con un timestamp único
        }
        catch (error) {
            console.error('Error al asignar el nombre del archivo:', error);
            cb(error, '');
        }
    }
};
// Esta función controla los achivos que quiere cargar y cuales deben omitirse
const fileFilter = (_req, file, cb) => {
    const allowTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowTypes.includes(file.mimetype)) {
        console.log("Archivo recibido:", file); // Imprimir detalles del archivo
        cb(null, true); // Extensión permitida
    }
    else {
        cb(new Error('Formato de archivo no permitido. Solo se aceptan JPG, JPEG, PNG O JFIF'));
    }
};
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage(storage),
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
exports.default = upload;
