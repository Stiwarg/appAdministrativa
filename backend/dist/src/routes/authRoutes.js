"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validateUserMiddleware_1 = require("../middlewares/validateUserMiddleware");
const loginSchema_1 = require("../schemas/loginSchema");
const companySchema_1 = require("../schemas/companySchema");
const companyController_1 = require("../controllers/companyController");
const imageUpload_1 = __importDefault(require("../config/imageUpload"));
const excelUpload_1 = __importDefault(require("../config/excelUpload"));
const multerMiddleware_1 = require("../middlewares/multerMiddleware");
const profileController_1 = require("../controllers/profileController");
const userSchema_1 = require("../schemas/userSchema");
const updatePasswordSchema_1 = require("../schemas/updatePasswordSchema");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const fileExcelsController_1 = require("../controllers/fileExcelsController");
const fileExcelsSchema_1 = require("../schemas/fileExcelsSchema");
const generateCertificateController_1 = require("../controllers/generateCertificateController");
const certificateSchema_1 = require("../schemas/certificateSchema");
const authController_2 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Ruta para ingresar con tus credenciales ( nit y password ) de Login
router.post('/login', (0, validateUserMiddleware_1.validateSchema)(loginSchema_1.loginSchema), authController_1.login);
// Ruta para validar la sesión
router.get('/auth/validate', authMiddleware_1.validateSession);
// Ruta para acceder a un lugar con token
router.get('/protected', authMiddleware_1.authenticateJWT, authController_1.welcomeUser);
// Ruta para verificar el acceso a la creación de empresas
router.get('/gestionEmpresas', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorize)([1]), companyController_1.managementCompaniesGet);
// Ruta para crear una empresa con el nameCompany y logo
router.post('/gestionEmpresas', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorize)([1]), imageUpload_1.default.single('logo'), multerMiddleware_1.multerErrorHandler, (0, validateUserMiddleware_1.validateSchema)(companySchema_1.companyCreateSchema), companyController_1.createCompanyController);
// Ruta para verificar el acceso para cambiar la contraseña
router.get('/changePassword', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorize)([1, 2]), profileController_1.changePasswordGet);
// Ruta de administrador
router.post('/admin/usersfind', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorize)([1]), (0, validateUserMiddleware_1.validateSchema)(userSchema_1.userSchemaWithNit), profileController_1.findUsersNit);
//Ruta para el administrador que puede cambiar la contraseña de cualquier usuario
router.patch('/admin/password', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorize)([1]), (0, validateUserMiddleware_1.validateSchema)(updatePasswordSchema_1.updatePasswordSchema), profileController_1.updatePassword);
//Ruta para cambiar la contraseña del propio usuario
router.patch('/employee/password', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorize)([2]), (0, validateUserMiddleware_1.validateSchema)(updatePasswordSchema_1.updatePasswordUpdateWithoutNit), profileController_1.updateOwnPassword);
// Para cerrar sesión
router.post('/logout', authController_1.logout);
// Ruta para subir un archivo excel 
router.post('/gestionExcels', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorize)([1]), excelUpload_1.default.single('nameFile'), multerMiddleware_1.multerErrorHandler, (0, validateUserMiddleware_1.validateSchemaFile)(fileExcelsSchema_1.filesExcelsSchema), fileExcelsController_1.uploadExcelToDatabase);
// Ruta par mirar todas las empresas
router.get('/empresasAplicativo', companyController_1.getCompanies);
// Ruta para poder ver las opciones para generar un certificado
router.get('/certificadosOpciones', generateCertificateController_1.getOptionsCertificate);
// Ruta para generar certificado
router.post('/certificado', authMiddleware_1.authenticateJWT, (0, validateUserMiddleware_1.validateSchema)(certificateSchema_1.certificateSchema), generateCertificateController_1.certificateController);
// Ruta para buscar si existen detalles para ese certificado
router.post('/buscarDetallesUsuario', authMiddleware_1.authenticateJWT, (0, validateUserMiddleware_1.validateSchema)(certificateSchema_1.certificateSchema), generateCertificateController_1.searchUserDetails);
// Ruta para mostrar los datos en el dashboard
router.post('/holi', authController_2.getUserCompany);
exports.default = router;
