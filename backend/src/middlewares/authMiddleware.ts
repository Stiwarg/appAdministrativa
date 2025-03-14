import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';
import { ICustomJwtPayload } from '../interfaces/interface';

export const authenticateJWT = ( req: Request, res: Response, next: NextFunction ) => {

    const token = req.cookies.token;
    console.log("🔍 Token recibido en authenticateJWT:", token);

    if ( !token ) {
        return res.status( 403 ).json({ message: 'Acceso denegado, token no proporcionado'});
    }

    try {
        const decoded = jwt.verify( token, jwtConfig.secret ) as ICustomJwtPayload;
        console.log("✅ Token decodificado correctamente:", decoded);
        req.user = decoded;
        console.log("✅ Usuario autenticado en req.user:", req.user); // ← Verifica si `rolId` está aquí
        return next();
    } catch ( error ) {
        console.error("❌ Error al verificar token:", error);
        return res.status( 401 ).json({ message: 'Token invalido o expirado'});
    }
}

export const authorize = ( allowedRoles: number[] ) => {

    return ( req: Request, res: Response, next: NextFunction ) => {
        console.log("🔍 Rol recibido en authorize:", req.user?.rolId); // ← Agrega esto
        const userRole = Number(req.user?.rolId); // 🔄 Convertir a número
        console.log("🔍 Rol recibido en authorize:", userRole, "Tipo:", typeof userRole);

        if ( !allowedRoles.includes( userRole )) {
            return res.status( 403 ).json({ message: 'No tienes permisos para acceder a esta ruta.'})
        }
        return next();
    }
}

export const validateSession = ( req: Request, res: Response ) => {
    const token = req.cookies.token; 
    console.log("🔍 Token recibido en validateSession:", token);

    if ( !token ) {
        return res.status( 401 ).json({ message: 'No autenticado' });
    }

    try {
        const decoded = jwt.verify( token, jwtConfig.secret ) as ICustomJwtPayload;
        console.log("✅ Token válido, usuario:", decoded);
        return res.json({ authenticated: true, user: decoded });

    } catch (error) {
        console.error("❌ Error al verificar token en validateSession:", error);
        return res.status( 401 ).json({ message: "Token inválido o expirado" });
    }
}
