import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';
import { ICustomJwtPayload } from '../interfaces/interface';

export const authenticateJWT = ( req: Request, res: Response, next: NextFunction ) => {

    const token = req.cookies.token;

    if ( !token ) {
        return res.status( 403 ).json({ message: 'Acceso denegado, token no proporcionado'});
    }

    try {
        const decoded = jwt.verify( token, jwtConfig.secret ) as ICustomJwtPayload;
        req.user = decoded;
        return next();
    } catch ( error ) {
        return res.status( 401 ).json({ message: 'Token invalido o expirado'});
    }
}

export const authorize = ( allowedRoles: number[] ) => {

    return ( req: Request, res: Response, next: NextFunction ) => {
        const userRole = req.user?.roleId;

        if ( !allowedRoles.includes( userRole )) {
            return res.status( 403 ).json({ message: 'No tienes permisos para acceder a esta ruta.'})
        }
        return next();
    }
}
