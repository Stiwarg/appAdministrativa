import cors from 'cors';
import { env } from './env';

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [ env.frontendUrl ] // En producción, usa el dominio real
    : ['http://localhost:3308', env.frontendUrl] // En desarrollo, permite localhost

console.log('Allowed Origins:',  allowedOrigins );

export const corsConfig = cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH' ],
    credentials: true
});