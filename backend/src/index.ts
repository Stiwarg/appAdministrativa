import express from 'express';
import { corsConfig } from './config/corsConfing';
import { env } from './config/env';
import sequelize, { testConnection } from './config/database';
import './models/relations/relations';
import authRoutes from './routes/authRoutes';
import { seedDatabase } from '../seeders/seedDatabase';
import cookieParser from 'cookie-parser';
import path from 'path';
import { printServerInfo } from './utils/serverLogger';
import { uploadsPath } from './utils/constantes';

const app = express();
app.use( cookieParser() );
app.use( corsConfig );
app.options('*', corsConfig );
app.use( express.json() );
app.get('/prueba', ( _req, res ) => {
    console.log('Someone prueba here!!');
    res.send('Holaaaa');
})
 
//app.use('/uploads', express.static( path.resolve('./uploads') ));

app.use('/uploads', express.static( uploadsPath ) );
app.use( '/api', authRoutes );
//http://localhost:3001/api/patients/
const startServer = async () => {
    try {
        // Probar conexión antes de sincronizar 
        await testConnection();

        if ( process.env.NODE_ENV === 'production') {
            await sequelize.sync({ alter: true }); // Borra las tablas existentes
            const frontendPath = path.join( process.cwd(), '../frontend/dist');
            app.use( express.static( frontendPath ) );
            app.get('*', ( _req, res ) => {
                res.sendFile( path.join( frontendPath, 'index.html') );
            });
            console.log("🚀 Modo Producción");
        } else {
            await sequelize.sync({ force: false }); // Borra las tablas existentes
            console.log("🛠️ Modo Desarrollo");

        }
        // Sincronizar modelos con la base de datos
        console.log('Base de datos sincronizada correctamente');
        await seedDatabase();
        app.listen( env.port, env.host , () => {
            //console.log(`🚀 Servidor iniciado en http://${env.host}:${env.port}`);
            printServerInfo( env.host, env.port, process.env.NODE_ENV!, env.backendUrl );
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error );
    }
}

startServer();


// Este es un codigo que se va utilizar en produccion
//await sequelize.sync({ alter: true });
