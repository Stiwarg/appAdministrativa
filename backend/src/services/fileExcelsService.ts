import FilesExcels from '../models/filesExcelsModel';
import { IFileInput } from '../interfaces/interface';
import { TNewFile } from '../types/type';
import { TypeFile } from '../utils/enums';
import path from 'path';
import { CompanyService } from '../services/companyService';
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
            const typeFile = typeMatch[0].toUpperCase() as TypeFile;

            const companyExists = await CompanyService.getCompanyById( data.empresaId );

            if ( !companyExists ) {
                throw new Error('La empresa con el ID proporcionado no existe.');
            }

            return await FilesExcels.create({
                nameFile: data.nameFile,
                empresaId: data.empresaId,
                typeFile: typeFile
            }) as TNewFile;
        } catch (error) {
            throw new Error('Error al guardar el Excel: ' + error );
        }
    } 

    
}