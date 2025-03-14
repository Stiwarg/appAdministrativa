import cors from 'cors';
import { env } from './env';

export const corsConfig = cors({
    origin: ['http://localhost:3308', env.frotendUrl ],
    methods: ['GET', 'POST', 'PUT', 'PATCH' ],
    credentials: true
});