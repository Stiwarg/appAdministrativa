"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesExcels = exports.uploadExcelToDatabase = void 0;
const fileExcelsService_1 = require("../services/fileExcelsService");
const xlsx_1 = __importDefault(require("xlsx"));
const path_1 = __importDefault(require("path"));
const fileDetailsService_1 = require("../services/fileDetailsService");
const fileDetailsSchema_1 = require("../schemas/fileDetailsSchema");
const constantes_1 = require("../utils/constantes");
const uploadExcelToDatabase = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'El campo archivo excel es obligatorio' });
        }
        // Validar los datos de entrada
        const empresaId = Number(req.body.empresaId);
        const { period, typeFile, year } = req.body;
        const excelPath = `/uploads/excels/${req.file.filename}`;
        const newFile = await fileExcelsService_1.FilesExcelsService.uploadExcelToDatabase({
            empresaId,
            nameFile: excelPath,
            period,
            typeFile,
            year
        });
        const document = path_1.default.join(constantes_1.uploadsPath, 'excels', req.file.filename);
        const workbook = xlsx_1.default.readFile(document);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = xlsx_1.default.utils.sheet_to_json(sheet, {
            header: 1, // Usamos el número de fila 1 para indicar que esa es la fila de encabezado
            range: 1, // Esto indica que empiezo a leer los datos de la segunda fila
        });
        //console.log('Pasa ');
        const validRows2 = sheetData.filter((row) => {
            try {
                fileDetailsSchema_1.filesDetailsShema.parse({
                    tpRete: row[0],
                    nitRegister: row[1],
                    dv: row[2],
                    nameCompany: row[3],
                    nameConcept: row[4],
                    base: row[5],
                    valueRetained: row[6],
                    percentage: row[7],
                });
                return true; // Si pasa la validación, la fila es válida
            }
            catch (error) {
                console.error('Fila invalida:', row, error.errors);
                return false; // Si no pasa la validación, omite la fila
            }
        });
        //console.log(`Filas válidas: ${ validRows2.length }`);
        //console.log(`Filas omitidas: ${ sheetData.length - validRows2.length }`);
        // Formatear datos
        const formattedData = validRows2.map((row) => ({
            tpRete: row[0],
            userId: row[1],
            dv: row[2],
            nameCompany: row[3],
            nameConcept: row[4],
            base: row[5],
            valueRetained: row[6],
            percentage: row[7],
            filesExcelsId: 0,
        }));
        //const desired = validRows[7];
        await fileDetailsService_1.FilesExcelsDetails.readExcel(formattedData, newFile.id, newFile.empresaId, period, typeFile, year);
        return res.status(201).json({
            message: 'Excel procesado y datos guardados correctamente',
            filasProcesadas: validRows2.length,
            filasOmitidas: sheetData.length - validRows2.length
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.uploadExcelToDatabase = uploadExcelToDatabase;
const getFilesExcels = async (_req, res) => {
    try {
        return res.status(200).json({ message: 'Tienes acceso a subir archivos excel.' });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.getFilesExcels = getFilesExcels;
