import { Request, Response } from 'express';
import { IFileInput } from '../interfaces/interface';
import { FilesExcelsService } from '../services/fileExcelsService';
export const uploadExcelToDatabase = async ( req: Request, res: Response ) => {
    try {
        if ( !req.file ) {
            return res.status( 400 ).json({ message: 'El campo archivo excel es obligatorio'});
        }

        // Validar los datos de entrada
        const { empresaId } : IFileInput = req.body;

        const excelPath = `/uploads/excels/${ req.file.filename }`;

        const newFile = await FilesExcelsService.uploadExcelToDatabase({
            empresaId,
            nameFile: excelPath
        });

        return res.status( 201 ).json({ message: 'Se ha guardado correctamente el registro de la compañia', newFile })

    } catch (error: any ) {
        return res.status( 400 ).json({ message: error.message });
    }
}