import { Request, Response } from 'express';
import { IFileInput } from '../interfaces/interface';
import { FilesExcelsService } from '../services/fileExcelsService';
import XLSX from 'xlsx';
import path from 'path';
import { TArrayOfArraysFileDetails, TNewFileDetails } from '../types/type';
import { FilesExcelsDetails } from '../services/fileDetailsService';
import { filesDetailsShema } from '../schemas/fileDetailsSchema';

export const uploadExcelToDatabase = async ( req: Request, res: Response ) => {
    try {
        if ( !req.file ) {
            return res.status( 400 ).json({ message: 'El campo archivo excel es obligatorio'});
        }

        // Validar los datos de entrada
        const empresaId = Number( req.body.empresaId );
        const { period, typeFile } : Omit<IFileInput, "empresaId"> = req.body;

        const excelPath = `/uploads/excels/${ req.file.filename }`;

        const newFile = await FilesExcelsService.uploadExcelToDatabase({
            empresaId,
            nameFile: excelPath,
            period,
            typeFile
        });

        const document = path.join(process.cwd(),'src','uploads','excels', req.file.filename );
        const workbook = XLSX.readFile( document );
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[ sheetName ];

        const sheetData = XLSX.utils.sheet_to_json( sheet, {
            header: 1, // Usamos el número de fila 1 para indicar que esa es la fila de encabezado
            range: 1, // Esto indica que empiezo a leer los datos de la segunda fila
        }) as  unknown as TArrayOfArraysFileDetails;

        //console.log('Pasa ');

        const validRows2 = sheetData.filter(( row ) => {
            try {
                filesDetailsShema.parse({
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
            } catch (error: any ) {
                console.error('Fila invalida:', row, error.errors );
                return false; // Si no pasa la validación, omite la fila
            }
        });

        //console.log(`Filas válidas: ${ validRows2.length }`);
        //console.log(`Filas omitidas: ${ sheetData.length - validRows2.length }`);

        // Formatear datos
        const formattedData: TNewFileDetails[] = validRows2.map(( row ) => ({
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
        await FilesExcelsDetails.readExcel( formattedData, newFile.id!, newFile.empresaId, period, typeFile );

        return res.status( 201 ).json({ 
            message: 'Excel procesado y datos guardados correctamente', 
            filasProcesadas: validRows2.length,
            filasOmitidas: sheetData.length - validRows2.length
         })

    } catch (error: any ) {
        return res.status( 400 ).json({ message: error.message });
    }
}

export const getFilesExcels = async ( _req: Request, res: Response ) => {
    try {
        return res.status( 200 ).json({ message: 'Tienes acceso a subir archivos excel.'});
    } catch (error: any ) {
        return res.status( 400 ).json({ message: error.message });
    }
}