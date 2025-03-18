"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesExcelsService = void 0;
const filesExcelsModel_1 = __importDefault(require("../models/filesExcelsModel"));
const enums_1 = require("../utils/enums");
const path_1 = __importDefault(require("path"));
const companyService_1 = require("../services/companyService");
//import dayjs from 'dayjs';
//import { isValidUploadDate } from '../utils/validateYear';
class FilesExcelsService {
    static async uploadExcelToDatabase(data) {
        try {
            if (!data.nameFile) {
                throw new Error('El archivo es obligatorio.');
            }
            const fileNameOnly = path_1.default.basename(data.nameFile);
            const typeMatch = fileNameOnly.match(/(IVA|ICA|RTE)/i);
            if (!typeMatch) {
                throw new Error('El nombre del archivo no cumple con el formato esperado.');
            }
            //const typeFile = typeMatch[0].toUpperCase() as TypeFile;
            const companyExists = await companyService_1.CompanyService.getCompanyById(data.empresaId);
            if (!companyExists) {
                throw new Error('La empresa con el ID proporcionado no existe.');
            }
            //const year = dayjs().year();
            const typeFile = data.typeFile;
            const period = data.period;
            // Validar si el periodo es válido antes de cualquier otra validación 
            if (!Object.values(enums_1.TypePeriod).includes(period)) {
                throw new Error(`El periodo "${data.period}" no es válido.`);
            }
            // Se valida la fecha de carga
            /*if ( !isValidUploadDate( year, period )) {
                console.log(`❌ Intento de carga después del límite: ${period} (${year})`);
                throw new Error(`El periodo de carga para ${ period } ha expirado.`)
            }*/
            //console.log(`📂 Subiendo archivo: ${fileNameOnly}, Empresa ID: ${data.empresaId}, Año: ${year}, Periodo: ${period}`);
            return await filesExcelsModel_1.default.create({
                nameFile: data.nameFile,
                empresaId: data.empresaId,
                typeFile: typeFile,
                year: data.year,
                period: period,
            });
        }
        catch (error) {
            throw new Error('Error al guardar el Excel: ' + error);
        }
    }
}
exports.FilesExcelsService = FilesExcelsService;
