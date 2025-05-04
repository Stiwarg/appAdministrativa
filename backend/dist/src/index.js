"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const corsConfing_1 = require("./config/corsConfing");
const env_1 = require("./config/env");
const database_1 = __importStar(require("./config/database"));
require("./models/relations/relations");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const seedDatabase_1 = require("../seeders/seedDatabase");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const serverLogger_1 = require("./utils/serverLogger");
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(corsConfing_1.corsConfig);
app.use(express_1.default.json());
app.options('*', corsConfing_1.corsConfig);
app.get('/prueba', (_req, res) => {
    console.log('Someone prueba here!!');
    res.send('Holaaaa');
});
//app.use('/uploads', express.static( path.resolve('./uploads') ));
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'src', 'uploads')));
app.use('/api', authRoutes_1.default);
//http://localhost:3001/api/patients/
const startServer = async () => {
    try {
        // Probar conexión antes de sincronizar 
        await (0, database_1.testConnection)();
        if (process.env.NODE_ENV === 'production') {
            await database_1.default.sync({ alter: true }); // Borra las tablas existentes
            const frontendPath = path_1.default.join(process.cwd(), '../frontend/dist');
            app.use(express_1.default.static(frontendPath));
            app.get('*', (_req, res) => {
                res.sendFile(path_1.default.join(frontendPath, 'index.html'));
            });
            console.log("🚀 Modo Producción");
        }
        else {
            await database_1.default.sync({ force: false }); // Borra las tablas existentes
            console.log("🛠️ Modo Desarrollo");
        }
        // Sincronizar modelos con la base de datos
        console.log('Base de datos sincronizada correctamente');
        await (0, seedDatabase_1.seedDatabase)();
        app.listen(env_1.env.port, env_1.env.host, () => {
            //console.log(`🚀 Servidor iniciado en http://${env.host}:${env.port}`);
            (0, serverLogger_1.printServerInfo)(env_1.env.host, env_1.env.port, process.env.NODE_ENV, env_1.env.backendUrl);
        });
    }
    catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};
startServer();
// Este es un codigo que se va utilizar en produccion
//await sequelize.sync({ alter: true });
