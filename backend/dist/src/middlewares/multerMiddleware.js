"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerErrorHandler = void 0;
const multer_1 = __importDefault(require("multer"));
const multerErrorHandler = (err, _req, res, next) => {
    // Errores especificos de Multer
    if (err instanceof multer_1.default.MulterError) {
        console.log('Error de Multer:', err); // Esto te dará más detalles
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({ message: 'El archivo supera el tamaño permitido.' });
            case 'LIMIT_FILE_COUNT':
                return res.status(400).json({ message: 'Excediste el número de archivos permitidos.' });
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({ message: 'El formato del archivo no es válido.' });
            default:
                return res.status(400).json({ message: 'Error en la carga del archivo.' });
        }
    }
    // Si el error proviene del 'fileFilter' y tiene el mensaje específico de un error por tipo de archivo no permitido
    if (err && err.message.includes('Formato de archivo no permitido')) {
        // Extraer el tipo de archivo esperado y devolver el mensaje dinámicamente
        const [_, fileType] = err.message.split(':');
        return res.status(400).json({
            message: `El archivo no tiene el formato válido, se requieren archivos ${fileType.trim()}.`
        });
    }
    // Otros errores
    if (err) {
        console.error('Error inesperado:', err);
        return res.status(500).json({ message: 'Error inesperado durante la carga de archivos.' });
    }
    // Si no hay errores, continua con el siguiente middleware
    return next();
};
exports.multerErrorHandler = multerErrorHandler;
