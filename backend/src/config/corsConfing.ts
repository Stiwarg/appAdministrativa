import cors from 'cors';
import { env } from './env';

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [ env.frotendUrl ] // En producción, usa el dominio real
    : ['http://localhost:3308', env.frotendUrl] // En desarrollo, permite localhost

export const corsConfig = cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH' ],
    credentials: true
});