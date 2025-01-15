import { Router } from 'express';
import { login, logout } from '../controllers/authController';
//import { validateLogin } from '../middlewares/validateUserMiddleware';
const router = Router();

router.post('/', login );
router.post('/logout', logout );

export default router;