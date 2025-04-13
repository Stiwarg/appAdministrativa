"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printServerInfo = void 0;
const printServerInfo = (host, port, mode, url) => {
    console.log(`🚀 Servidor iniciado en modo ${mode.toUpperCase()}`);
    if (mode === 'production' && url) {
        console.log(`🌐 Accede a tu app en: ${url}`);
    }
    else {
        console.log(`📡 URL local: http://${host}:${port}`);
    }
};
exports.printServerInfo = printServerInfo;
