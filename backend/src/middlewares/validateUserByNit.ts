import { UserService } from '../services/userService';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware hace la busqueda del por su nit y lo adjunta al objeto req. 
*/

export const validateUserByNit = async ( req: Request, res: Response, next: NextFunction ) => {
    const { nit } = req.body;
    try {
        // Buscar al usuario
        const user = await UserService.findByNit( nit );
        // Si se encuentra, se adjunta al objeto 'req' y continuamos
        req.user = user;
        next();

    } catch (error: any ) {
        res.status( 404 ).json({ message: error.message });
    }
}