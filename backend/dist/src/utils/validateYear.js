"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUploadDate = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const isLeapYear_1 = __importDefault(require("dayjs/plugin/isLeapYear"));
const enums_1 = require("../utils/enums");
// Cargar el plugin 
dayjs_1.default.extend(isLeapYear_1.default);
// Función para verificar si el año es bisiesto y ajustar la fecha de fin de febrero 
const getEndDateForFebruary = (year) => {
    return (0, dayjs_1.default)(`${year}-02-01`).isLeapYear() ? `${year}-02-29` : `${year}-02-28`;
};
// Definimos las fechas de finalización de cada período 
const isValidUploadDate = (year, period) => {
    const periodEndDate = {
        [enums_1.TypePeriod.ENERO_FEBRERO]: getEndDateForFebruary(year),
        [enums_1.TypePeriod.MARZO_ABRIL]: `${year}-04-30`,
        [enums_1.TypePeriod.MAYO_JUNIO]: `${year}-06-30 `,
        [enums_1.TypePeriod.JULIO_AGOSTO]: `${year}-08-31`,
        [enums_1.TypePeriod.SEPTIEMBRE_OCTUBRE]: `${year}-10-31`,
        [enums_1.TypePeriod.NOVIEMBRE_DICIEMBRE]: `${year}-12-31`,
        [enums_1.TypePeriod.ENERO]: `${year}-01-31`,
        [enums_1.TypePeriod.FEBRERO]: getEndDateForFebruary(year),
        [enums_1.TypePeriod.MARZO]: `${year}-03-31`,
        [enums_1.TypePeriod.ABRIL]: `${year}-04-30`,
        [enums_1.TypePeriod.MAYO]: `${year}-05-31`,
        [enums_1.TypePeriod.JUNIO]: `${year}-06-30`,
        [enums_1.TypePeriod.JULIO]: `${year}-07-31`,
        [enums_1.TypePeriod.AGOSTO]: `${year}-08-31`,
        [enums_1.TypePeriod.SEPTIEMBRE]: `${year}-09-30`,
        [enums_1.TypePeriod.OCTUBRE]: `${year}-10-31`,
        [enums_1.TypePeriod.NOVIEMBRE]: `${year}-11-30`,
        [enums_1.TypePeriod.DICIEMBRE]: `${year}-12-31`,
    };
    if (!periodEndDate[period])
        return false;
    // Fecha limite limite ( 10 días después del final del periodo )
    //const deadline = dayjs( periodEndDate[ period ]).add( 10, 'days');
    // Fecha limite para subir archivos ( 10 dias ANTES del final del periodo )    const deadline2 = dayjs( periodEndDate[ period ]).subtract( 10, 'days');
    const deadline2 = (0, dayjs_1.default)(periodEndDate[period]).subtract(10, 'days');
    // Si la fecha actual es menor o igual al límite la carga es válida
    return (0, dayjs_1.default)().isBefore(deadline2);
};
exports.isValidUploadDate = isValidUploadDate;
