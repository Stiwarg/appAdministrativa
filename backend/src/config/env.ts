import dotenv from 'dotenv';
import { IConfig } from '../interfaces/interface';
import path from 'path';

const envPath = path.resolve( __dirname, '../../.env');
dotenv.config({ path: envPath });

export const env: IConfig = {
    
    port: process.env.PORT || '3308',
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