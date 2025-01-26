import { Router } from 'express';
import { login, logout } from '../controllers/authController';
import { validateSchema, validateSchemaFile } from '../middlewares/validateUserMiddleware';
import { loginSchema } from '../schemas/loginSchema';
import { companyCreateSchema } from '../schemas/companySchema';
import { createCompanyController, getCompanies } from '../controllers/companyController';
import uploadImg from '../config/imageUpload';
import uploadExcels from '../config/excelUpload';
import { multerErrorHandler } from '../middlewares/multerMiddleware';
import { findUsersNit, updatePassword } from '../controllers/profileController';
import { userSchemaWithNit } from '../schemas/userSchema';
import { updatePasswordSchema, updatePasswordUpdateWithoutNit } from '../schemas/updatePasswordSchema';
import { authenticateJWT, authorize } from '../middlewares/authMiddleware';
import { uploadExcelToDatabase } from '../controllers/fileExcelsController';
import { filesExcelsSchema } from '../schemas/fileExcelsSchema';
const router = Router();

// Ruta para ingresar con tus credenciales ( nit y password ) de Login
router.post('/',validateSchema( loginSchema ), login );

// Ruta para crear una empresa con el nameCompany y logo
router.post('/gestionEmpresas', uploadImg.single( 'logo'), multerErrorHandler, validateSchema( companyCreateSchema ) ,createCompanyController );

// Ruta de administrador
router.post('/admin/usersfind', authenticateJWT, authorize([1]) , validateSchema( userSchemaWithNit ) ,findUsersNit );

//Ruta para el administrador que puede cambiar la contraseña de cualquier usuario
router.patch('/admin/password', authenticateJWT, authorize([ 1 ]),validateSchema( updatePasswordSchema ) ,updatePassword );

router.patch('/employee/password', authenticateJWT, authorize([ 2 ]), validateSchema( updatePasswordUpdateWithoutNit ))
router.post('/logout',logout );

// Ruta para subir un archivo excel 
router.post('/gestionExcels', uploadExcels.single('nameFile'), multerErrorHandler, validateSchemaFile( filesExcelsSchema ),uploadExcelToDatabase );

router.get('/empresas', getCompanies );

export default router;