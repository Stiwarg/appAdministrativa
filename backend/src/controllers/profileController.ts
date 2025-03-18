import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { IFindByNit, IUpdatePassword } from '../interfaces/interface';

export const findUsersNit = async ( req: Request, res: Response ) => {
    try {
        console.log('Empezar hacer la busqueda');
        const { nit } : IFindByNit = req.body;

        const userFound = await UserService.findByNit( nit )

        if ( !userFound ) {
            return res.status( 404 ).json({ message: 'Usuario no encontrado.' });
        }

        return res.status( 201 ).json({ message: 'Usuario encontrado', user: userFound });
    } catch (error: any ) {
        return res.status( 400 ).json({ message: error.message });
    }
}

// password seria el confirmPassword
export const updatePassword = async ( req: Request, res: Response ) => {

    try {
        console.log('Iniciando actualización de contraseña...');
        const { nit, newPassword, password }: IUpdatePassword = req.body;

        console.log('Este es newPassword: ', newPassword );
        console.log('Este es confirmPassword:', password );

        if ( newPassword !== password ) {
            return res.status( 400 ).json({ message: 'Las contraseñas no coinciden'});
        }

        const user = await UserService.findByNit( nit );

        console.log('Este es el nit:', user.nit );

        const userProfile = {
            ...user,
            password
        }
        
        const hashedPassword = await UserService.hashPasswordBeforeCreate( userProfile  ); 
        console.log('Esta es la contraseña hashedPassword:', hashedPassword.password );
        await UserService.updatePassword( user.nit , hashedPassword.password );

        return res.status( 200 ).json({ message: 'Contraseña actualizada con exito.' })
    } catch ( error: any ) {
        return res.status( 500 ).json({ message: error.message });
    }
}

// Actualizar la contraseña del propio usuario
export const updateOwnPassword = async ( req: Request, res: Response ) => {
    try {
        console.log('Iniciando actualización de contraseña por el propio usuario...');

        // Obtener los datos del usuario autenticado ( asumiendo que jwt almacena en req.user)
        const user = req.user;
        console.log('Este es el user:', user );

        const { newPassword, password } = req.body;

        if ( !user || user.rolId !== 2 ) {
            return res.status( 403 ).json({ message: 'Acceso denegado'});
        }

        // Asegurar que las contraseñas coincidan
        if ( newPassword !== password ) {
            return res.status( 400 ).json({ message: 'Las contraseñas no coinciden.'});
        }

        const userData = {
            nit: user.nit,
            password: password,
            companyId: user.companyId!,
            rolId: user.rolId
        };

        // Actualizar la contraseña
        console.log('Este es el password:', password);
        console.log('Este es el newPassword:', newPassword );
        const hashedPassword = await UserService.hashPasswordBeforeCreate( userData );
        console.log('Esta es la contraseña hashed: ', hashedPassword );
        await UserService.updatePassword( user.nit, hashedPassword.password );

        return res.status( 200 ).json({ message: 'Contraseña actualizado con éxito' });
    } catch (error: any ) {
        return res.status( 500 ).json({ message: error.message })
    }
}

export const changePasswordGet = async ( _req: Request, res: Response ) => {
    try {
        return res.status( 200 ).json({ message: 'Tienes acceso a cambiar la contraseña.'});
    } catch (error: any ) {
        return res.status( 400 ).json({ message: error.message });
    }
}
