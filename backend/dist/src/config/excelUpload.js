"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("../utils/multer"));
const path_1 = __importDefault(require("path"));
/**
 * Función para subir archivos Excel de la version xlsx y xls
 */
const excelUpload = (0, multer_1.default)({
    destinationPath: path_1.default.join(process.cwd(), 'src', 'uploads', 'excels'),
    allowedMimeTypes: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ],
    maxFileSizeMB: 5,
});
exports.default = excelUpload;
