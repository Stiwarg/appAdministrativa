"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const UsersModel_1 = __importDefault(require("../models/UsersModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtConfig_1 = require("../config/jwtConfig");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    static async autheticatelogin(loginData) {
        const { nit, password } = loginData;
        const user = await UsersModel_1.default.findOne({ where: { nit: nit }, attributes: ['nit', 'password', 'rolId'] });
        console.log('Este es el usuario: ', user);
        if (!user) {
            console.log('Error no se encontro el usuario');
            throw new Error('Usuario no encontrado');
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Contraseña incorrecta');
            throw new Error('Contraseña incorrecta');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, nit: user.nit, companyId: user.companyId, rolId: user.rolId }, jwtConfig_1.jwtConfig.secret, { expiresIn: jwtConfig_1.jwtConfig.expiresIn });
        console.log('Este es el token:', token);
        return token;
    }
    static async refreshToken(oldRefreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(oldRefreshToken, jwtConfig_1.jwtConfig.secret);
            const newToken = jsonwebtoken_1.default.sign({ id: decoded.id, nit: decoded.nit, companyId: decoded.companyId, rolId: decoded.rolId }, jwtConfig_1.jwtConfig.secret, { expiresIn: jwtConfig_1.jwtConfig.refreshTokenExpiresIn });
            return newToken;
        }
        catch (error) {
            throw new Error('Token invalido o expirado.');
        }
    }
}
exports.AuthService = AuthService;
