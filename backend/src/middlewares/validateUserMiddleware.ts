import { Request, Response, NextFunction } from 'express';
//import { userSchemaWithoutRol } from '../schemas/userSchema';
//import { loginSchema } from '../schemas/loginSchema';
import { z, ZodError } from 'zod';

/*export const validateCreateUser = ( req: Request, res: Response, next: NextFunction ) => {
    try {
        userSchemaWithoutRol.parse( req.body ); // Valida y lanza error si no es válido
        next();
    } catch (error) {
        res.status( 400 ).json({ message: error })
    }
}

export const validateLogin = ( req: Request, res: Response, next: NextFunction ) => {
    try {
        loginSchema.parse( req.body );
        next();
    } catch (error) {
        res.status( 400 ).json({ message: 'Error de validación', errors: error });
    }
}
*/
export const validateSchema = ( schema: z.ZodTypeAny ) => ( req: Request, res: Response, next: NextFunction ): void => {
    try {
        schema.parse( req.body ); // Valida los datos de req.body
        next(); // si es valido, pasa el siguiente middleware/controlador
    } catch (error) {
        if ( error instanceof ZodError ) {
            res.status( 400 ).json({
                message: 'Error de validación',
                errors: error.errors.map( ( e ) => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            });
            return; // Asegura que no se ejecute ningún código después
        }
        // Para otros errores, se devuelve un 500
        res.status( 500 ).json({ message: 'Error inesperado'});
        return;
    }
}