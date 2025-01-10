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
const app = (0, express_1.default)();
app.use(corsConfing_1.corsConfig);
app.use(express_1.default.json());
app.get('/prueba', (_req, res) => {
    console.log('Someone prueba here!!');
    res.send('Holaaaa');
});
const startServer = async () => {
    try {
        // Probar conexión antes de sincronizar 
        await (0, database_1.testConnection)();
        // Sincronizar modelos con la base de datos
        await database_1.default.sync({ force: true }); // Borra las tablas existentes
        console.log('Base de datos sincronizada correctamente');
        app.listen(env_1.env.port, () => {
            console.log(`Server running on http://localhost:${env_1.env.port}`);
        });
    }
    catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};
startServer();
