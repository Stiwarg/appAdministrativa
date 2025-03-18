"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserDetails = exports.getOptionsCertificate = exports.certificateController = void 0;
const pdfService_1 = require("../services/pdfService");
const errors_1 = require("../utils/errors");
const certificateController = async (req, res) => {
    try {
        let { nit, year, typeFile, period } = req.body;
        const user = req.user;
        if (user && user.rolId === 2) {
            nit = user.nit;
        }
        if (!nit) {
            return res.status(403).json({ message: "Acceso denegado" });
        }
        await pdfService_1.PDFDocumentServices.certificateGeneration(nit, year, typeFile, period, res);
        return;
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error('Error al generar el certificado:', error);
        return res.status(500).send('Error al generar el certificado.');
    }
};
exports.certificateController = certificateController;
const getOptionsCertificate = async (_req, res) => {
    try {
        const options = await pdfService_1.PDFDocumentServices.generateOptionsCertificate();
        return res.json(options);
    }
    catch (error) {
        console.error('Error al obtener las opciones de certificado:', error);
        return res.status(500).send('Error al obtener las opciones de certificado.');
    }
};
exports.getOptionsCertificate = getOptionsCertificate;
const searchUserDetails = async (req, res) => {
    try {
        let { nit, year, typeFile, period } = req.body;
        const user = req.user;
        if (user && user.rolId === 2) {
            nit = user.nit;
        }
        if (!nit) {
            return res.status(403).json({ message: "Acceso denegado" });
        }
        const { message, certificateFound } = await pdfService_1.PDFDocumentServices.getUserCertificateDetails(nit, year, typeFile, period);
        return res.status(200).json({
            message,
            certificateFound
        });
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error("Error al buscar detalles del usuario:", error);
        return res.status(500).send('Error al buscar detalles del usuario.');
    }
};
exports.searchUserDetails = searchUserDetails;
