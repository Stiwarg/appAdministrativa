"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserByNit = void 0;
const userService_1 = require("../services/userService");
/**
 * Middleware hace la busqueda del por su nit y lo adjunta al objeto req.
*/
const validateUserByNit = async (req, res, next) => {
    const { nit } = req.body;
    try {
        // Buscar al usuario
        const user = await userService_1.UserService.findByNit(nit);
        // Si se encuentra, se adjunta al objeto 'req' y continuamos
        req.user = user;
        next();
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.validateUserByNit = validateUserByNit;
