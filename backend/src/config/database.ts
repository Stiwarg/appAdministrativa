import { Sequelize } from 'sequelize';
import { env } from './env';


const sequelize = new Sequelize( env.db.database, env.db.user, env.db.password, {
    host: env.db.host,
    dialect: 'mysql',
    port: env.db.dbPort,
    logging: console.log
});
console.log('este es el port de la base de datos:',env.db.dbPort);


export default sequelize;

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database established successfully.');
    } catch ( error ) {
        console.error('Unable to connect to the database:', error);
    }
}