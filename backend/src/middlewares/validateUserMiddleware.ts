import { Request, Response, NextFunction } from 'express';
import { userSchemaWithoutRol } from '../schemas/userSchema';
import { loginSchema } from '../schemas/loginSchema';

export const validateCreateUser = ( req: Request, res: Response, next: NextFunction ) => {
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