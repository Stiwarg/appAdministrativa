import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';

export const authenticateJWT = ( req: Request, res: Response, next: NextFunction ) => {

    const token = req.cookies.token;

    if ( !token ) {
        return res.status( 403 ).json({ message: 'Acceso denegado, token no proporcionado'});
    }

    try {
        const decoded = jwt.verify( token, jwtConfig.secret );
        req.user = decoded;
        return next();
    } catch ( error ) {
        return res.status( 401 ).json({ message: 'Token invalido o expirado'});
    }
}

