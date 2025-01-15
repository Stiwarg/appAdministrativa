import Roles from '../src/models/rolesModel';

const seedRoles = async () => {
    try {
        const roles = ['Administrador', 'Empleado'];

        await Promise.all(
            roles.map( async ( roleName ) => {
                const [ _, created ] = await Roles.findOrCreate({
                    where: { nameRol: roleName.trim().toLowerCase() },
                    defaults: { nameRol: roleName.trim().toLowerCase() },
                });

                if ( !created ) {
                    console.log(`Role '${roleName}' ya existia.`);
                }
            })
        )

        console.log('Roles creados correctamente');
    } catch (error) {
        console.error('Error l crear los roles:', error);
    }

};

export default seedRoles;