"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordGet = exports.updateOwnPassword = exports.updatePassword = exports.findUsersNit = void 0;
const userService_1 = require("../services/userService");
const findUsersNit = async (req, res) => {
    try {
        console.log('Empezar hacer la busqueda');
        const { nit } = req.body;
        const userFound = await userService_1.UserService.findByNit(nit);
        if (!userFound) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        return res.status(201).json({ message: 'Usuario encontrado', user: userFound });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.findUsersNit = findUsersNit;
// password seria el confirmPassword
const updatePassword = async (req, res) => {
    try {
        console.log('Iniciando actualización de contraseña...');
        const { nit, newPassword, password } = req.body;
        console.log('Este es newPassword: ', newPassword);
        console.log('Este es confirmPassword:', password);
        if (newPassword !== password) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }
        const user = await userService_1.UserService.findByNit(nit);
        console.log('Este es el nit:', user.nit);
        const userProfile = {
            ...user,
            password
        };
        const hashedPassword = await userService_1.UserService.hashPasswordBeforeCreate(userProfile);
        console.log('Esta es la contraseña hashedPassword:', hashedPassword.password);
        await userService_1.UserService.updatePassword(user.nit, hashedPassword.password);
        return res.status(200).json({ message: 'Contraseña actualizada con exito.' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.updatePassword = updatePassword;
// Actualizar la contraseña del propio usuario
const updateOwnPassword = async (req, res) => {
    try {
        console.log('Iniciando actualización de contraseña por el propio usuario...');
        // Obtener los datos del usuario autenticado ( asumiendo que jwt almacena en req.user)
        const user = req.user;
        console.log('Este es el user:', user);
        const { newPassword, password } = req.body;
        if (!user || user.rolId !== 2) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        // Asegurar que las contraseñas coincidan
        if (newPassword !== password) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
        }
        const userData = {
            nit: user.nit,
            password: password,
            companyId: user.companyId,
            rolId: user.rolId
        };
        // Actualizar la contraseña
        console.log('Este es el password:', password);
        console.log('Este es el newPassword:', newPassword);
        const hashedPassword = await userService_1.UserService.hashPasswordBeforeCreate(userData);
        console.log('Esta es la contraseña hashed: ', hashedPassword);
        await userService_1.UserService.updatePassword(user.nit, hashedPassword.password);
        return res.status(200).json({ message: 'Contraseña actualizado con éxito' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.updateOwnPassword = updateOwnPassword;
const changePasswordGet = async (_req, res) => {
    try {
        return res.status(200).json({ message: 'Tienes acceso a cambiar la contraseña.' });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.changePasswordGet = changePasswordGet;
