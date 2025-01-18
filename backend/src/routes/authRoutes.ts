import { Router } from 'express';
import { login, logout } from '../controllers/authController';
import { validateSchema } from '../middlewares/validateUserMiddleware';
import { loginSchema } from '../schemas/loginSchema';
import { companyCreateSchema } from '../schemas/companySchema';
import { createCompanyController } from '../controllers/companyController';
import upload from '../config/multer';
import { multerErrorHandler } from '../middlewares/multerMiddleware';

const router = Router();

router.post('/',validateSchema( loginSchema ), login );
router.post('/gestionEmpresas', upload.single( 'logo'), multerErrorHandler, validateSchema( companyCreateSchema ) ,createCompanyController );
router.post('/logout',logout );

export default router;