import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';

/*export const login = async ( req: Request, res: Response ) => {
    try {
        const token = await AuthService.autheticatelogin( req.body );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).json({ message: 'Login exitoso'});
    } catch (error) {
        res.status(401).json({ message: error })
    }
}*/
//const isProduction = process.env.NODE_ENV === 'production';

export const login = async ( req: Request, res: Response ) => {
    try {
        const token = await AuthService.autheticatelogin( req.body );
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, //isProduction En desarrollo, se usa 'false' porque no hay HTTPS
            sameSite: 'lax', // none si hay HTTPS, lax para desarrollo isProduction ? 'none' : 'lax'
            path: '/'
        });
        res.status(200).json({ message: 'Login exitoso'});
    } catch (error: any) {
        //console.error("❌ Error en login:", error.message);
        res.status(401).json({ message: error || 'Error al iniciar sesión' })
    }
}
export const logout = ( _req: Request , res: Response ) => {

    try {
        
        /*res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });*/
        res.clearCookie('token', {
            httpOnly: true,
            secure: false, // isProduction En desarrollo, se usa 'false' porque no hay HTTPS
            sameSite: 'lax', // none si hay HTTPS, lax para desarrollo isProduction ? 'none' : 'lax'
            path: '/' // Asegúrate de que la cookie se elimine en la ruta correcta
        });
    
        return res.status( 200 ).json({ message: 'Sesión cerrada exitosamente '});
    } catch (error) {
        return res.status( 500 ).json({ message: 'Error al cerrar sesión', error: error });
    }
}

export const welcomeUser = async ( req: Request, res: Response ) => {
    if ( !req.user ) {
        return res.status( 403 ).json({ message: 'Acceso denegado' });
    }
    try {
        // Obtener el nit del usuario autenticado
        const nit = req.user.nit;

        // Obtener los datos de la empresa del usuario
        const userCompany = await UserService.getUserCompany( nit );

        if ( !userCompany ) {
            return res.status( 404 ).json({ message: "No se encontró información de la empresa del usuario" });
        }

        return res.json({
            message: 'Bienvenido al área protegido',
            user: req.user,
            company: userCompany.data,
        });

    } catch (error) {
        //console.error('Error en welcomeUser:', error );
        return res.status( 500 ).json({ message: 'Error interno del servidor.'});   
    }
}

export const getUserCompany = async (req: Request, res: Response) => {
    try {
        const { nit } = req.body; // Ahora recibimos el NIT desde el body

        if (!nit) {
            return res.status(400).json({ success: false, message: "El NIT es requerido" });
        }
        const response = await UserService.getUserCompany( nit );

        return res.json(response);
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};
