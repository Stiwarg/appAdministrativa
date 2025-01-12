import { Router } from 'express';

const router = Router();

router.get('/', ( _req, res ) => {
    res.send('Bienvenido al backend de la aplicación. ')
})

export default router;