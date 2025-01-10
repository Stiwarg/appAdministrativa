"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = require("./env");
const pool = promise_1.default.createPool({
    host: env_1.env.db.host,
    user: env_1.env.db.user,
    password: env_1.env.db.password,
    database: env_1.env.db.database
});
exports.default = pool;
