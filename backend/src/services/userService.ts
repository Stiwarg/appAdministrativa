import bcrypt from 'bcrypt';
import Users from '../models/UsersModel';
import { TFoundUser, TNewUser, TNewUserEmployee } from '../types/type';
// Aqui se escribe la logica relacionada a la funcionalidad del modelo osea del negocio

export class UserService {

    static async hashPasswordBeforeCreate ( data: TNewUser ): Promise< TNewUser > {
        if ( data.password ) {
            data.password = await bcrypt.hash( data.password, 10 );
            console.log('cc:', data.password );
        }
        return data;
    }

    static async createUser ( data: TNewUser ): Promise< TNewUser > {
        
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

    static async createEmployee ( data: TNewUserEmployee ): Promise<TNewUserEmployee> {
        const dataWithRole = { ...data, rolId: 2 };

        return await UserService.createUser( dataWithRole );
    }

    static async findByNit ( nit: number ): Promise< TFoundUser > {

        try {
            console.log('Empezar hacer la busqueda');
            const user = await Users.findOne({
                where: { nit: nit },
                attributes: ['id','nit', 'companyId', 'rolId']
            });

            if ( !user ) {
                console.log(`Usuario con NIT ${ nit } no encontrado`);
                throw new Error(`Usuario con NIT ${ nit } no encontrado.`)
            }

            return user as TFoundUser;

        } catch (error) {
            throw new Error('Error al buscar el usuario: ' + error);
        }

    }

    static async updatePassword (nit: number, hashedPassword: string ): Promise< void > {
        try {
            console.log("dentra a la funcion");
            console.log('Contraseña: ', hashedPassword);
            const [ rowsUpdated ] = await Users.update({
                password: hashedPassword
            },
            { where: { nit } })
            console.log("pasa la consulta?");

            if ( rowsUpdated === 0 ) {
                console.log(`No se pudo actualizar la contraseña para el usuario con NIT ${ nit }.`);
                throw new Error(`No se pudo actualizar la contraseña para el usuario con NIT ${ nit }.`);
            }

            console.log(`Contraseña actualizada correctamente para el usuario con NIT ${nit}.`);
        } catch (error) {
            throw new Error('Error al actualizar la contraseña: ' + error );
        }
    }
}