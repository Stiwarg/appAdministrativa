import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export const login = async ( req: Request, res: Response ) => {
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
}

export const logout = ( _req: Request , res: Response ) => {

    try {
        
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
    
        return res.status( 200 ).json({ message: 'Sesión cerrada exitosamente '});
    } catch (error) {
        return res.status( 500 ).json({ message: 'Error al cerrar sesión', error: error });
    }
}