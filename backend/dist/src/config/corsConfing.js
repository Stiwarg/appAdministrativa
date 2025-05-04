"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./env");
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [env_1.env.frontendUrl] // En producción, usa el dominio real
    : ['http://localhost:3308', env_1.env.frontendUrl]; // En desarrollo, permite localhost
console.log('Allowed Origins:', allowedOrigins);
exports.corsConfig = (0, cors_1.default)({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
    credentials: true
});
