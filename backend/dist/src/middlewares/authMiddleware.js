"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSession = exports.authorize = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtConfig_1 = require("../config/jwtConfig");
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;
    console.log("🔍 Token recibido en authenticateJWT:", token);
    if (!token) {
        return res.status(403).json({ message: 'Acceso denegado, token no proporcionado' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtConfig_1.jwtConfig.secret);
        console.log("✅ Token decodificado correctamente:", decoded);
        req.user = decoded;
        console.log("✅ Usuario autenticado en req.user:", req.user); // ← Verifica si `rolId` está aquí
        return next();
    }
    catch (error) {
        console.error("❌ Error al verificar token:", error);
        return res.status(401).json({ message: 'Token invalido o expirado' });
    }
};
exports.authenticateJWT = authenticateJWT;
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        console.log("🔍 Rol recibido en authorize:", req.user?.rolId); // ← Agrega esto
        const userRole = Number(req.user?.rolId); // 🔄 Convertir a número
        console.log("🔍 Rol recibido en authorize:", userRole, "Tipo:", typeof userRole);
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta.' });
        }
        return next();
    };
};
exports.authorize = authorize;
const validateSession = (req, res) => {
    const token = req.cookies.token;
    console.log("🔍 Token recibido en validateSession:", token);
    if (!token) {
        return res.status(401).json({ message: 'No autenticado' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtConfig_1.jwtConfig.secret);
        console.log("✅ Token válido, usuario:", decoded);
        return res.json({ authenticated: true, user: decoded });
    }
    catch (error) {
        console.error("❌ Error al verificar token en validateSession:", error);
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};
exports.validateSession = validateSession;
