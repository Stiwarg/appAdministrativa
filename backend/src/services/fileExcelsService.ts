import FilesExcels from '../models/filesExcelsModel';
import { IFileInput } from '../interfaces/interface';
import { TNewFile } from '../types/type';
import { TypeFile, TypePeriod } from '../utils/enums';
import path from 'path';
import { CompanyService } from '../services/companyService';
//import dayjs from 'dayjs';
//import { isValidUploadDate } from '../utils/validateYear';

export class FilesExcelsService {
    static async uploadExcelToDatabase ( data: IFileInput ): Promise< TNewFile > {

        try {
            if ( !data.nameFile ) {
                throw new Error('El archivo es obligatorio.');
            }
            const fileNameOnly = path.basename( data.nameFile );
            const typeMatch = fileNameOnly.match(/(IVA|ICA|RTE)/i);
            if ( !typeMatch ) {
                throw new Error('El nombre del archivo no cumple con el formato esperado.');
            }
            //const typeFile = typeMatch[0].toUpperCase() as TypeFile;

            const companyExists = await CompanyService.getCompanyById( data.empresaId );

            if ( !companyExists ) {
                throw new Error('La empresa con el ID proporcionado no existe.');
            }

            //const year = dayjs().year();
            const typeFile = data.typeFile as TypeFile;
            const period = data.period as TypePeriod;

            // Validar si el periodo es válido antes de cualquier otra validación 
            if ( !Object.values( TypePeriod ).includes( period )) {
                throw new Error(`El periodo "${ data.period }" no es válido.`)
            }

            // Se valida la fecha de carga
            /*if ( !isValidUploadDate( year, period )) {
                console.log(`❌ Intento de carga después del límite: ${period} (${year})`);
                throw new Error(`El periodo de carga para ${ period } ha expirado.`)
            }*/

            //console.log(`📂 Subiendo archivo: ${fileNameOnly}, Empresa ID: ${data.empresaId}, Año: ${year}, Periodo: ${period}`);
            return await FilesExcels.create({
                nameFile: data.nameFile,
                empresaId: data.empresaId,
                typeFile: typeFile,
                year: data.year,
                period: period,
            }) as TNewFile;
        } catch (error) {
            throw new Error('Error al guardar el Excel: ' + error );
        }
    } 

    
}