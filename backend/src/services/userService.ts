import bcrypt from 'bcrypt';
import Users from '../models/UsersModel';
import { TFoundUser, TNewUser, TNewUserEmployee } from '../types/type';
import { TUserFromSchema, TUserWithoutRol   } from '../schemas/userSchema';
// Aqui se escribe la logica relacionada a la funcionalidad del modelo osea del negocio

export class UserService {

    static async hashPasswordBeforeCreate ( data: TUserFromSchema ): Promise< TNewUser > {
        if ( data.password ) {
            data.password = await bcrypt.hash( data.password, 10 );
            console.log('cc:', data.password );
        }
        return data;
    }

    static async createUser ( data: TUserFromSchema ): Promise< TNewUser > {
        
        const existingUser = await Users.findOne({ where: { nit: data.nit } });
        if ( existingUser ) {
            throw new Error(`Ya existe un usuario con el NIT: ${ data.nit }`);
        }

        const hashedData = await UserService.hashPasswordBeforeCreate( data );
        console.log('c:', hashedData );
        try {
            const newUser = await Users.create( hashedData );
            return newUser;
        } catch (error) {
            throw new Error('Error a crear al usuario:' + error );
        }
    }

    static async createEmployee ( data: TUserWithoutRol ): Promise<TNewUserEmployee> {
        const dataWithRole = { ...data, rolId: 2 };

        return await UserService.createUser( dataWithRole );
    }

    static async findByNit ( nit: number ): Promise< TFoundUser | null > {

        try {
            const user = await Users.findOne({
                where: { nit: nit },
                attributes: ['nit', 'companyId', 'rolId']
            });

            if ( !user ) {
                throw new Error(`Usuario con NIT ${ nit } no encontrado.`)
            }

            return user as TFoundUser;

        } catch (error) {
            throw new Error('Error al buscar el usuario: ' + error);
        }

    }
}