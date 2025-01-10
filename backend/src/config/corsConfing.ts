import cors from 'cors';

export const corsConfig = cors({
    origin: ['http://localhost:3308', 'https://cesarpopular.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH' ],
    credentials: true
});