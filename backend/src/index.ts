import express from 'express';
import { corsConfig } from './config/corsConfing';
import { env } from './config/env';
import sequelize, { testConnection } from './config/database';
import './models/relations/relations';
//import { Users, Roles, Companies, Certificates, FileDetails, FilesExcels} from './models/relations/relations';

const app = express();
app.use( corsConfig );
app.use( express.json() );

app.get('/prueba', ( _req, res ) => {
    console.log('Someone prueba here!!');
    res.send('Holaaaa');
})

const startServer = async () => {
    try {
        // Probar conexión antes de sincronizar 
        await testConnection();

        // Sincronizar modelos con la base de datos
        await sequelize.sync({ force: true }); // Borra las tablas existentes
        console.log('Base de datos sincronizada correctamente');

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
