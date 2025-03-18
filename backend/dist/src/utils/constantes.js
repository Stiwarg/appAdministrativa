"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeFileToCertificate = exports.certificateToTypeFile = exports.identityOrPersonalData = exports.retainerData = exports.month = exports.bimesters = void 0;
const enums_1 = require("./enums");
exports.bimesters = [
    enums_1.TypePeriod.ENERO_FEBRERO, enums_1.TypePeriod.MARZO_ABRIL, enums_1.TypePeriod.MAYO_JUNIO,
    enums_1.TypePeriod.JULIO_AGOSTO, enums_1.TypePeriod.SEPTIEMBRE_OCTUBRE, enums_1.TypePeriod.NOVIEMBRE_DICIEMBRE
];
exports.month = [
    enums_1.TypePeriod.ENERO, enums_1.TypePeriod.FEBRERO, enums_1.TypePeriod.MARZO, enums_1.TypePeriod.ABRIL, enums_1.TypePeriod.MAYO,
    enums_1.TypePeriod.JUNIO, enums_1.TypePeriod.JULIO, enums_1.TypePeriod.AGOSTO, enums_1.TypePeriod.SEPTIEMBRE, enums_1.TypePeriod.OCTUBRE,
    enums_1.TypePeriod.NOVIEMBRE, enums_1.TypePeriod.DICIEMBRE
];
exports.retainerData = [
    { label: 'Razón Sociall........................................: ', value: 'APREX TOOL GROUP S.A.S' },
    { label: 'NIT........................................................: ', value: '890.311.366' },
    { label: 'Dirección...............................................: ', value: 'AV CL 26 69 D 91 TO 1 OF 406 BOGOTA' },
    { label: 'Año Gravable.......................................: ', value: '2024' },
    { label: 'Lugar donde se consigno la Retención: ', value: 'BOGOTA' },
];
exports.identityOrPersonalData = [
    { label: 'Apellidos y Nombres o Razón Social...: ', value: 'D LA ROSSE DESING SAS' },
    { label: 'NIT......................................................: ', value: '901413092-9' },
    { label: 'Concepto de la Retención...................: ', value: 'COMPRAS Y/O SERVICIOS' }
];
// Función que se va utilizar proximamente para mapear de Certificate a TypeFile en el Frontend
exports.certificateToTypeFile = {
    [enums_1.Certificate.CERTIFICADO_RETENCION_IVA]: enums_1.TypeFile.IVA,
    [enums_1.Certificate.CERTIFICADO_INDUSTRIA_COMERCIO]: enums_1.TypeFile.ICA,
    [enums_1.Certificate.CERTIFICADO_RETENCION_FUENTE_RTE]: enums_1.TypeFile.RTE
};
exports.typeFileToCertificate = {
    [enums_1.Certificate.CERTIFICADO_RETENCION_IVA]: ["Todos", ...exports.bimesters], // IVA usa bimestres
    [enums_1.Certificate.CERTIFICADO_INDUSTRIA_COMERCIO]: ["Todos", ...exports.bimesters], // ICA usa bimestres
    [enums_1.Certificate.CERTIFICADO_RETENCION_FUENTE_RTE]: ["Todos", ...exports.month] // RTE usa meses
};
