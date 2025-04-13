import dotenv from 'dotenv';
import { IConfig } from '../interfaces/interface';
import path from 'path';

//const envPath = path.resolve( __dirname, '../../.env');
const envPath = path.join( process.cwd(), '.env');
dotenv.config({ path: envPath });

export const env: IConfig = {
    
    host: process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'),
    port: Number(process.env.PORT) || 3308,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    backendUrl: process.env.BACKEND_URL || 'http://localhost:3308',
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'administrationsdb',
        dbPort: Number(process.env.DB_PORT) || 3306 // Convierte a número
    },
    jwt: {
        secretKey: process.env.SECRET_JWT_KEY || 'defaultSecret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    }
}
//console.log('Cargando variables de entorno:', process.env );

console.log('🔍 Ruta del archivo .env:', envPath);
console.log('🔑 SECRET_KEY:', process.env.SECRET_JWT_KEY); // O cualquier otra variable que tengas en .env
console.log('🔐 Variables de entorno cargadas:', {
    host: process.env.HOST,
    port: process.env.PORT,
    frontend: process.env.FRONTEND_URL,
    backend: process.env.BACKEND_URL,
    dbHost: process.env.DB_HOST,
    jwtKey: process.env.SECRET_JWT_KEY
});
