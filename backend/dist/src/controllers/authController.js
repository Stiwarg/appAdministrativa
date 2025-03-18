"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCompany = exports.welcomeUser = exports.logout = exports.login = void 0;
const authService_1 = require("../services/authService");
const userService_1 = require("../services/userService");
/*export const login = async ( req: Request, res: Response ) => {
    try {
        const token = await AuthService.autheticatelogin( req.body );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).json({ message: 'Login exitoso'});
    } catch (error) {
        res.status(401).json({ message: error })
    }
}*/
const login = async (req, res) => {
    try {
        const token = await authService_1.AuthService.autheticatelogin(req.body);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // En desarrollo, se usa 'false' porque no hay HTTPS
            sameSite: 'strict'
        });
        res.status(200).json({ message: 'Login exitoso' });
    }
    catch (error) {
        //console.error("❌ Error en login:", error.message);
        res.status(401).json({ message: error || 'Error al iniciar sesión' });
    }
};
exports.login = login;
const logout = (_req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        return res.status(200).json({ message: 'Sesión cerrada exitosamente ' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al cerrar sesión', error: error });
    }
};
exports.logout = logout;
const welcomeUser = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    try {
        // Obtener el nit del usuario autenticado
        const nit = req.user.nit;
        // Obtener los datos de la empresa del usuario
        const userCompany = await userService_1.UserService.getUserCompany(nit);
        if (!userCompany) {
            return res.status(404).json({ message: "No se encontró información de la empresa del usuario" });
        }
        return res.json({
            message: 'Bienvenido al área protegido',
            user: req.user,
            company: userCompany.data,
        });
    }
    catch (error) {
        //console.error('Error en welcomeUser:', error );
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
exports.welcomeUser = welcomeUser;
const getUserCompany = async (req, res) => {
    try {
        const { nit } = req.body; // Ahora recibimos el NIT desde el body
        if (!nit) {
            return res.status(400).json({ success: false, message: "El NIT es requerido" });
        }
        const response = await userService_1.UserService.getUserCompany(nit);
        return res.json(response);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};
exports.getUserCompany = getUserCompany;
