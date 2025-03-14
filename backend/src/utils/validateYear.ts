import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import { TypePeriod } from '../utils/enums';
// Cargar el plugin 
dayjs.extend( isLeapYear );

// Función para verificar si el año es bisiesto y ajustar la fecha de fin de febrero 
const getEndDateForFebruary = ( year: number ) => {
    return dayjs(`${ year }-02-01`).isLeapYear() ? `${ year }-02-29` : `${ year }-02-28`;
};

// Definimos las fechas de finalización de cada período 
export const isValidUploadDate = ( year: number, period: TypePeriod ): boolean => {
    const periodEndDate : { [ key in TypePeriod ]: string } = {
        [TypePeriod.ENERO_FEBRERO]: getEndDateForFebruary( year ),
        [TypePeriod.MARZO_ABRIL]: `${ year }-04-30`,
        [TypePeriod.MAYO_JUNIO]: `${ year }-06-30 `,
        [TypePeriod.JULIO_AGOSTO]: `${ year }-08-31`,
        [TypePeriod.SEPTIEMBRE_OCTUBRE]: `${ year }-10-31`,
        [TypePeriod.NOVIEMBRE_DICIEMBRE]: `${ year }-12-31`,
        [TypePeriod.ENERO]: `${ year }-01-31`,
        [TypePeriod.FEBRERO]: getEndDateForFebruary( year ),
        [TypePeriod.MARZO]: `${ year }-03-31`,
        [TypePeriod.ABRIL]: `${ year }-04-30`,
        [TypePeriod.MAYO]: `${ year }-05-31`,
        [TypePeriod.JUNIO]: `${ year }-06-30`,
        [TypePeriod.JULIO]: `${ year }-07-31`,
        [TypePeriod.AGOSTO]: `${ year }-08-31`,
        [TypePeriod.SEPTIEMBRE]: `${ year }-09-30`,
        [TypePeriod.OCTUBRE]: `${ year }-10-31`,
        [TypePeriod.NOVIEMBRE]: `${ year }-11-30`,
        [TypePeriod.DICIEMBRE]: `${ year }-12-31`,
    };

    if ( !periodEndDate[ period ]) return false;
    // Fecha limite limite ( 10 días después del final del periodo )
    //const deadline = dayjs( periodEndDate[ period ]).add( 10, 'days');

    // Fecha limite para subir archivos ( 10 dias ANTES del final del periodo )    const deadline2 = dayjs( periodEndDate[ period ]).subtract( 10, 'days');

    const deadline2 = dayjs( periodEndDate[ period ]).subtract( 10, 'days');

    // Si la fecha actual es menor o igual al límite la carga es válida
    return dayjs().isBefore( deadline2 );
};