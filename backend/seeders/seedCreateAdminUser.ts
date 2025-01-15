import Companies from '../src/models/companiesModel';
import Roles from '../src/models/rolesModel';
import { UserService } from '../src/services/userService';


// Primero se busca el rol 'Administrador'
// hasheamos la contraseña
// creamos el usuario administrador si no existe

const seedAdminUser = async (): Promise<void> => {
    try {

        const admin = 'administrador'
        const adminRole = await Roles.findOne({ where: { nameRol: admin.toLowerCase() } });

        const nameCompanyOwnsApplication = 'Cesar Saucedo Salazar S.A.S';

        const companyOwns = await Companies.findOne({ where: { nameCompany: nameCompanyOwnsApplication } });

        if ( adminRole && companyOwns ) {

            const adminData = {
                nit: 11010101,
                password:'CesarPopular2025',
                rolId: adminRole.id,
                companyId: companyOwns.id
            };
            /*const employeData = {
                nit: 110101021,
                password: '1',
                companyId: companyOwns.id
            };*/
            const newAdminUser = await UserService.createUser( adminData );
            //console.log('Usuario administrador:', newAdminUser);
            //const newEmployeUser = await UserService.createEmployee( employeData );
            console.log('Usuario administrador creado:', newAdminUser );
            //console.log('Usuario empleado creado:', newEmployeUser );

        } else{ 
            console.log('Rol administrador no encontrado.');
        }

    } catch (error) {
        console.error('Error al crear el usuario administrador:', error);
    }
}

export default seedAdminUser;