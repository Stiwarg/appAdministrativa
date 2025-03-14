import { Certificate, TypeFile, TypePeriod } from "./enums";

export const bimesters = [
    TypePeriod.ENERO_FEBRERO, TypePeriod.MARZO_ABRIL, TypePeriod.MAYO_JUNIO,
    TypePeriod.JULIO_AGOSTO, TypePeriod.SEPTIEMBRE_OCTUBRE, TypePeriod.NOVIEMBRE_DICIEMBRE
];

export const month = [
    TypePeriod.ENERO, TypePeriod.FEBRERO, TypePeriod.MARZO, TypePeriod.ABRIL, TypePeriod.MAYO,
    TypePeriod.JUNIO, TypePeriod.JULIO, TypePeriod.AGOSTO, TypePeriod.SEPTIEMBRE, TypePeriod.OCTUBRE,
    TypePeriod.NOVIEMBRE, TypePeriod.DICIEMBRE
];

export const retainerData = [
    { label: 'Razón Sociall........................................: ', value:'APREX TOOL GROUP S.A.S' },
    { label: 'NIT........................................................: ', value:'890.311.366' },
    { label: 'Dirección...............................................: ', value:'AV CL 26 69 D 91 TO 1 OF 406 BOGOTA' },
    { label: 'Año Gravable.......................................: ', value:'2024'},
    { label: 'Lugar donde se consigno la Retención: ', value:'BOGOTA' },
]

export const identityOrPersonalData = [
    { label: 'Apellidos y Nombres o Razón Social...: ', value:'D LA ROSSE DESING SAS' },
    { label: 'NIT......................................................: ', value: '901413092-9' },
    { label: 'Concepto de la Retención...................: ', value:'COMPRAS Y/O SERVICIOS'} 
];

// Función que se va utilizar proximamente para mapear de Certificate a TypeFile en el Frontend
export const certificateToTypeFile: Record< Certificate, TypeFile > = {
    [ Certificate.CERTIFICADO_RETENCION_IVA ] : TypeFile.IVA,
    [ Certificate.CERTIFICADO_INDUSTRIA_COMERCIO ] : TypeFile.ICA,
    [ Certificate.CERTIFICADO_RETENCION_FUENTE_RTE ] : TypeFile.RTE
};

export const typeFileToCertificate: Record< Certificate, TypePeriod[] > = {
    [ Certificate.CERTIFICADO_RETENCION_IVA ] : ["Todos" as unknown as TypePeriod, ...bimesters], // IVA usa bimestres
    [ Certificate.CERTIFICADO_INDUSTRIA_COMERCIO ] : ["Todos" as unknown as TypePeriod , ...bimesters], // ICA usa bimestres
    [ Certificate.CERTIFICADO_RETENCION_FUENTE_RTE ] : ["Todos" as unknown as TypePeriod, ...month]  // RTE usa meses
}; 