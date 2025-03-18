import { Router } from 'express';
import { login, logout, welcomeUser } from '../controllers/authController';
import { validateSchema, validateSchemaFile } from '../middlewares/validateUserMiddleware';
import { loginSchema } from '../schemas/loginSchema';
import { companyCreateSchema } from '../schemas/companySchema';
import { createCompanyController, getCompanies, managementCompaniesGet } from '../controllers/companyController';
import uploadImg from '../config/imageUpload';
import uploadExcels from '../config/excelUpload';
import { multerErrorHandler } from '../middlewares/multerMiddleware';
import { changePasswordGet, findUsersNit, updateOwnPassword, updatePassword } from '../controllers/profileController';
import { userSchemaWithNit } from '../schemas/userSchema';
import { updatePasswordSchema, updatePasswordUpdateWithoutNit } from '../schemas/updatePasswordSchema';
import { authenticateJWT, authorize, validateSession } from '../middlewares/authMiddleware';
import { uploadExcelToDatabase } from '../controllers/fileExcelsController';
import { filesExcelsSchema } from '../schemas/fileExcelsSchema';
import { certificateController, getOptionsCertificate, searchUserDetails } from '../controllers/generateCertificateController';
import { certificateSchema } from '../schemas/certificateSchema';
import { getUserCompany } from '../controllers/authController';
const router = Router();

// Ruta para ingresar con tus credenciales ( nit y password ) de Login
router.post('/login',validateSchema( loginSchema ), login );
// Ruta para validar la sesión
router.get('/auth/validate', validateSession );
// Ruta para acceder a un lugar con token
router.get('/protected', authenticateJWT, welcomeUser );
// Ruta para verificar el acceso a la creación de empresas
router.get('/gestionEmpresas', authenticateJWT, authorize([1]) , managementCompaniesGet );
// Ruta para crear una empresa con el nameCompany y logo
router.post('/gestionEmpresas', authenticateJWT ,authorize([1]) ,uploadImg.single( 'logo'), multerErrorHandler, validateSchema( companyCreateSchema ) ,createCompanyController );
// Ruta para verificar el acceso para cambiar la contraseña
router.get('/changePassword', authenticateJWT, authorize([1,2]), changePasswordGet );
// Ruta de administrador
router.post('/admin/usersfind', authenticateJWT , authorize([ 1 ]),  validateSchema( userSchemaWithNit ) ,findUsersNit );
//Ruta para el administrador que puede cambiar la contraseña de cualquier usuario
router.patch('/admin/password', authenticateJWT, authorize([ 1 ]) ,validateSchema( updatePasswordSchema ) ,updatePassword );
//Ruta para cambiar la contraseña del propio usuario
router.patch('/employee/password', authenticateJWT, authorize([ 2 ]), validateSchema( updatePasswordUpdateWithoutNit ), updateOwnPassword );
// Para cerrar sesión
router.post('/logout',logout );
// Ruta para subir un archivo excel 
router.post('/gestionExcels', authenticateJWT , authorize([ 1 ]) , uploadExcels.single('nameFile'), multerErrorHandler, validateSchemaFile( filesExcelsSchema ),uploadExcelToDatabase );
// Ruta par mirar todas las empresas
router.get('/empresasAplicativo', getCompanies );
// Ruta para poder ver las opciones para generar un certificado
router.get('/certificadosOpciones', getOptionsCertificate );
// Ruta para generar certificado
router.post('/certificado',  authenticateJWT ,validateSchema( certificateSchema ), certificateController );
// Ruta para buscar si existen detalles para ese certificado
router.post('/buscarDetallesUsuario', authenticateJWT ,validateSchema( certificateSchema ), searchUserDetails );
// Ruta para mostrar los datos en el dashboard
router.post('/holi',  getUserCompany )

export default router;