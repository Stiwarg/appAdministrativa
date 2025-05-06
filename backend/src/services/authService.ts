import { ILogin } from "../interfaces/interface";
import Users from "../models/UsersModel";
import bcrypt from 'bcrypt';
import { jwtConfig } from '../config/jwtConfig';
import jwt from 'jsonwebtoken';

export class AuthService{

    static async autheticatelogin( loginData: ILogin ): Promise< string > {

        const { nit, password } = loginData; 
        const user = await Users.findOne( { where: { nit: nit }, attributes: ['nit', 'password', 'rolId'] } );
        console.log('Este es el usuario: ', user );
        if ( !user ) {
            console.log('Error no se encontro el usuario');
            throw new Error('Usuario no encontrado')
        }
        const isPasswordValid = await bcrypt.compare( password, user.password );
        if ( !isPasswordValid ) {
            console.log('Contraseña incorrecta');
            throw new Error('Contraseña incorrecta');
        }

        const token = jwt.sign(
            { id: user.id, nit: user.nit, companyId: user.companyId ,rolId: user.rolId},
            jwtConfig.secret, 
            { expiresIn: jwtConfig.expiresIn }
        );

        console.log('Este es el token:', token );
        return token; 
    }

    static async refreshToken( oldRefreshToken: string ): Promise<string> {
        try {
            const decoded = jwt.verify( oldRefreshToken, jwtConfig.secret ) as jwt.JwtPayload;
            const newToken = jwt.sign(
                { id: decoded.id, nit: decoded.nit, companyId: decoded.companyId, rolId: decoded.rolId}, 
                jwtConfig.secret,
                { expiresIn: jwtConfig.refreshTokenExpiresIn }
            );

            return newToken 
        } catch (error) {
            throw new Error('Token invalido o expirado.');
        }
    }
}