"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
/**
 * Función generica para crear que permite personalizar aspectos especificos como la ruta de destino, los filtros de archivo y los limites de tamaño.
 */
const createMulterUpload = (options) => {
    // Configuración de almacenamiento de imágenes
    const storage = {
        destination: (_req, _file, cb) => {
            try {
                cb(null, options.destinationPath);
            }
            catch (error) {
                console.error('Error durante la carga:', error);
                cb(error, '');
            }
        },
        filename: (_req, file, cb) => {
            try {
                const timestamp = Date.now();
                cb(null, `${timestamp}_${file.originalname}`);
            }
            catch (error) {
                cb(error, '');
            }
        },
    };
    // Esta función controla los achivos que quiere cargar y cuales deben omitirse
    const fileFilter = (_req, file, cb) => {
        if (options.allowedMimeTypes.includes(file.mimetype)) {
            console.log('Archivo recibido:', file); // Imprimir detalles del archivo
            cb(null, true); // Extensión permitida 
        }
        else {
            cb(new Error(`Formato de archivo no permitido. Solo se aceptan: ${options.allowedMimeTypes.join()}`));
        }
    };
    return (0, multer_1.default)({
        storage: multer_1.default.diskStorage(storage),
        fileFilter,
        limits: { fileSize: options.maxFileSizeMB * 1024 * 1024 },
    });
};
exports.default = createMulterUpload;
