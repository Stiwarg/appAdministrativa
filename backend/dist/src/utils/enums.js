"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certificate = exports.TypePeriod = exports.TypeFile = void 0;
var TypeFile;
(function (TypeFile) {
    TypeFile["ICA"] = "ICA";
    TypeFile["IVA"] = "IVA";
    TypeFile["RTE"] = "RTE";
})(TypeFile || (exports.TypeFile = TypeFile = {}));
;
var TypePeriod;
(function (TypePeriod) {
    // Bimestres ( para IVA e ICA )
    TypePeriod["ENERO_FEBRERO"] = "Enero-Febrero";
    TypePeriod["MARZO_ABRIL"] = "Marzo-Abril";
    TypePeriod["MAYO_JUNIO"] = "Mayo-Junio";
    TypePeriod["JULIO_AGOSTO"] = "Julio-Agosto";
    TypePeriod["SEPTIEMBRE_OCTUBRE"] = "Septiembre-Octubre";
    TypePeriod["NOVIEMBRE_DICIEMBRE"] = "Noviembre-Diciembre";
    // MESES ( para RTE )
    TypePeriod["ENERO"] = "Enero";
    TypePeriod["FEBRERO"] = "Febrero";
    TypePeriod["MARZO"] = "Marzo";
    TypePeriod["ABRIL"] = "Abril";
    TypePeriod["MAYO"] = "Mayo";
    TypePeriod["JUNIO"] = "Junio";
    TypePeriod["JULIO"] = "Julio";
    TypePeriod["AGOSTO"] = "Agosto";
    TypePeriod["SEPTIEMBRE"] = "Septiembre";
    TypePeriod["OCTUBRE"] = "Octubre";
    TypePeriod["NOVIEMBRE"] = "Noviembre";
    TypePeriod["DICIEMBRE"] = "Diciembre";
})(TypePeriod || (exports.TypePeriod = TypePeriod = {}));
;
var Certificate;
(function (Certificate) {
    Certificate["CERTIFICADO_RETENCION_IVA"] = "Certificado de Retenci\u00F3n IVA";
    Certificate["CERTIFICADO_RETENCION_FUENTE_RTE"] = "Certificado de Retenci\u00F3n en la fuente (RTE)";
    Certificate["CERTIFICADO_INDUSTRIA_COMERCIO"] = "Certificado de Industria y Comercio (ICA)";
})(Certificate || (exports.Certificate = Certificate = {}));
