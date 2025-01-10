"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certificates = exports.FilesExcels = exports.FileDetails = exports.Roles = exports.Users = exports.Companies = void 0;
const rolesModel_1 = __importDefault(require("../rolesModel"));
exports.Roles = rolesModel_1.default;
const CertificatesModel_1 = __importDefault(require("../CertificatesModel"));
exports.Certificates = CertificatesModel_1.default;
const companiesModel_1 = __importDefault(require("../companiesModel"));
exports.Companies = companiesModel_1.default;
const filesExcelsModel_1 = __importDefault(require("../filesExcelsModel"));
exports.FilesExcels = filesExcelsModel_1.default;
const filesDetailsModel_1 = __importDefault(require("../filesDetailsModel"));
exports.FileDetails = filesDetailsModel_1.default;
const UsersModel_1 = __importDefault(require("../UsersModel"));
exports.Users = UsersModel_1.default;
// Deficinición relaciones
// Empresas - Usuarios
companiesModel_1.default.hasMany(UsersModel_1.default, { foreignKey: 'companyId' }); // Una empresa tiene muchos usuarios.
UsersModel_1.default.belongsTo(companiesModel_1.default, { foreignKey: 'companyId' }); // Un usuario pertenece a una empresa.
// Roles- Usuarios
rolesModel_1.default.hasMany(UsersModel_1.default, { foreignKey: 'rolId' }); // Un rol tiene muchos usuarios.
UsersModel_1.default.belongsTo(rolesModel_1.default, { foreignKey: 'rolId' }); // Un usuario tiene un rol.
// Empresa- Archivo Excel
companiesModel_1.default.hasMany(filesExcelsModel_1.default, { foreignKey: 'empresaId' }); // Una empresa tiene muchos archivos Excels.
filesExcelsModel_1.default.belongsTo(companiesModel_1.default, { foreignKey: 'empresaId' }); // Un archivo excel pertenece a una empresa
// Archivo Excel - Detalle del archivo excel
filesExcelsModel_1.default.hasMany(filesDetailsModel_1.default, { foreignKey: 'filesExcelsId' });
filesDetailsModel_1.default.belongsTo(filesExcelsModel_1.default, { foreignKey: 'filesExcelsId' });
// Certificado con usuario y Empresa
UsersModel_1.default.hasMany(CertificatesModel_1.default, { foreignKey: 'userId' });
companiesModel_1.default.hasMany(CertificatesModel_1.default, { foreignKey: 'companyId' });
CertificatesModel_1.default.belongsTo(UsersModel_1.default, { foreignKey: 'userId' });
CertificatesModel_1.default.belongsTo(companiesModel_1.default, { foreignKey: 'companyId' });
