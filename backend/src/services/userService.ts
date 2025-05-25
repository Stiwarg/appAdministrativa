import bcrypt from 'bcrypt';
import Users from '../models/UsersModel';
import { TFoundUser, TNewUser, TNewUserEmployee } from '../types/type';
import Companies from '../models/companiesModel';
import { env } from '../config/env';
import { IUser } from '../interfaces/interface';
// Aqui se escribe la logica relacionada a la funcionalidad del modelo osea del negocio

export class UserService {

    static async hashPasswordBeforeCreate ( data: TNewUser ): Promise< TNewUser > {
        console.log('holaaaaa:', data.password);
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

    static async findByNit ( nit: number ): Promise< TFoundUser | null > {

        try {
            console.log('Empezar hacer la busqueda');
            const user = await Users.findOne({
                where: { nit: nit },
                attributes: ['id','nit', 'companyId', 'rolId']
            });

            /*if ( !user ) {
                console.log(`Usuario con NIT ${ nit } no encontrado`);
                throw new Error(`Usuario con NIT ${ nit } no encontrado.`)
            }*/

            return user as TFoundUser | null ;

        } catch (error) {
            throw new Error('Error al buscar el usuario: ' + error);
        }

    }

    static async findOrCreateEmployeeBy( nit: number, companyId: number ): Promise< TFoundUser > {

        try {
            // Intentar encontrar el usuario por NIT
            let user = await UserService.findByNit( nit );

            console.log('Estos son los usuarios que se buscan: ', user );
            // Si el usuario no existe, crearlo
            if (!user) {
                const newUser = await UserService.createEmployee({
                    nit, 
                    password: nit.toString(),
                    companyId: companyId
                });
                //console.log(`Estos son los usuarios nuevos que se crearon con el nit ${ nit }: `, newUser);
                return newUser; // Se retorna el nuevo usuario
            }

            return user; // Se retorna el usuairo encontrado.

        } catch (error: any ) {
            throw new Error('Error en la búsqueda o creación del usuario: ' + error);
        }
    }
  
    static async findOrCreateEmployeeBy3 ( nit: number, companyId: number ): Promise< TFoundUser > {
        try {
            const [ user, created ] = await Users.findOrCreate({
                where: { nit },
                defaults: {
                    nit,
                    password: nit.toString(),
                    companyId,
                    rolId: 2,
                },
                attributes: ['id', 'nit', 'companyId','rolId'],
            });

            if ( created ) {
                console.log(`Usuario con NIT ${ nit } creado`);
            } else {
                console.log(`Usuario con NIT ${ nit } ya existe`);
            }

            return user as TFoundUser;

        } catch (error) {
            throw new Error('Error en la búsqueda o creación del usuario: ' + error );
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


    static async getUserCompany ( nit: number ) {
        try {
            const result = await Users.findOne({
                attributes: ['nit'],
                where: { nit: nit },
                include: [{
                    model: Companies,
                    attributes: ['logo','name_company'],
                }],
            });

            console.log('[getUserCompany] Resultado de la consulta:', result);
            if ( !result ) {
                console.log('[getUserCompany] No se encontró ningún usuario con el NIT:', nit);
                return null
            };

            const userCompany = result.get({ plain: true }) as IUser & { Company?: { logo: string; name_company: string}}; 
            //return userCompany;
            console.log('[getUserCompany] Resultado de la consulta (objeto plano):', userCompany);
            console.log('Nombre de la empresa:', userCompany.Company?.name_company);
            //console.log('URL final del logo:', `${env.backendUrl}${userCompany.Company?.logo}`);
            console.log('URL final del logo2:', `${ env.frontendUrl }${ userCompany.Company?.logo}`);
            return {
                data: {
                    nit: userCompany.nit,
                    nameCompany: userCompany.Company?.name_company ?? '',
                    logo: `${ env.frontendUrl }${ userCompany.Company?.logo ?? '' }`
                }
            }

        } catch (error) {
            throw new Error('Error fetching data: ' + error );
        }
    }
}