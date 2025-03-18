"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const seedCreateAdminUser_1 = __importDefault(require("./seedCreateAdminUser"));
const seedCreateCompanyCesar_1 = __importDefault(require("./seedCreateCompanyCesar"));
const seedCreateRoles_1 = __importDefault(require("./seedCreateRoles"));
const seedDatabase = async () => {
    try {
        await (0, seedCreateRoles_1.default)();
        await (0, seedCreateCompanyCesar_1.default)();
        await (0, seedCreateAdminUser_1.default)();
        console.log('Seeder ejecutado correctamente');
    }
    catch (error) {
        console.error('Error al ejecutar el seeder:', error);
    }
};
exports.seedDatabase = seedDatabase;
