import Roles from '../rolesModel';
import Certificates from '../CertificatesModel';
import Companies from '../companiesModel';
import FilesExcels from '../filesExcelsModel';
import FilesDetails from '../filesDetailsModel';
import Users from '../UsersModel';

// Deficinición relaciones

// Empresas - Usuarios
Companies.hasMany( Users, { foreignKey: 'company_id' }); // Una empresa tiene muchos usuarios.
Users.belongsTo( Companies, { foreignKey: 'company_id' }); // Un usuario pertenece a una empresa.
// Roles- Usuarios
Roles.hasMany( Users, { foreignKey: 'rol_id' }); // Un rol tiene muchos usuarios.
Users.belongsTo( Roles, { foreignKey: 'rol_id' }); // Un usuario tiene un rol.
// Empresa- Archivo Excel
Companies.hasMany( FilesExcels, { foreignKey: 'empresa_id' }); // Una empresa tiene muchos archivos Excels.
FilesExcels.belongsTo( Companies, { foreignKey: 'empresa_id' }); // Un archivo excel pertenece a una empresa
// Archivo Excel - Detalle del archivo excel
FilesExcels.hasMany( FilesDetails, { foreignKey: 'filesExcels_id' });
FilesDetails.belongsTo( FilesExcels, { foreignKey: 'filesExcels_id' });
// Certificado con usuario y Empresa
Users.hasMany( Certificates, { foreignKey: 'user_id' });
Companies.hasMany( Certificates, { foreignKey: 'company_id' });
Certificates.belongsTo( Users, { foreignKey: 'user_id' });
Certificates.belongsTo( Companies, { foreignKey: 'company_id' });

export { Companies, Users, Roles, FilesDetails, FilesExcels, Certificates };