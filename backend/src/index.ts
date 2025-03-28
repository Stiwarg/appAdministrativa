import express from 'express';
import { corsConfig } from './config/corsConfing';
import { env } from './config/env';
import sequelize, { testConnection } from './config/database';
import './models/relations/relations';
import authRoutes from './routes/authRoutes';
import { seedDatabase } from '../seeders/seedDatabase';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();
app.use( cookieParser() );
app.use( corsConfig );
app.use( express.json() );

app.get('/prueba', ( _req, res ) => {
    console.log('Someone prueba here!!');
    res.send('Holaaaa');
})

//app.use('/uploads', express.static( path.resolve('./uploads') ));
app.use('/uploads', express.static( path.join( process.cwd(), 'src', 'uploads') ) );
app.use( '/api', authRoutes );
//http://localhost:3001/api/patients/
const startServer = async () => {
    try {
        // Probar conexión antes de sincronizar 
        await testConnection();

        if ( process.env.NODE_ENV === 'production') {
            await sequelize.sync({ alter: true }); // Borra las tablas existentes
            console.log("🚀 Modo Producción");
        } else {
            await sequelize.sync({ force: false }); // Borra las tablas existentes
            console.log("🛠️ Modo Desarrollo");

        }
        // Sincronizar modelos con la base de datos
        console.log('Base de datos sincronizada correctamente');
        await seedDatabase();
        app.listen( env.port, () => {
            console.log(`Server running on http://localhost:${env.port}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error );
    }
}

startServer();


// Este es un codigo que se va utilizar en produccion
//await sequelize.sync({ alter: true });
