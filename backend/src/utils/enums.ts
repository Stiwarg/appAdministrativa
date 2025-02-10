export enum TypeFile {
    ICA = 'ICA',
    IVA = 'IVA',
    RTE = 'RTE' 
};

export enum TypePeriod {
    // Bimestres ( para IVA e ICA )
    ENERO_FEBRERO = "Enero-Febrero",
    MARZO_ABRIL = "Marzo-Abril",
    MAYO_JUNIO = "Mayo-Junio",
    JULIO_AGOSTO = "Julio-Agosto",
    SEPTIEMBRE_OCTUBRE = "Septiembre-Octubre",
    NOVIEMBRE_DICIEMBRE = "Noviembre-Diciembre",
    // MESES ( para RTE )
    ENERO = "Enero",
    FEBRERO = "Febrero",
    MARZO = "Marzo",
    ABRIL = "Abril",
    MAYO = "Mayo",
    JUNIO = "Junio",
    JULIO = "Julio",
    AGOSTO = "Agosto",
    SEPTIEMBRE = "Septiembre",
    OCTUBRE = "Octubre",
    NOVIEMBRE = "Noviembre",
    DICIEMBRE = "Diciembre"
};

export enum Certificate {
    CERTIFICADO_RETENCION_IVA = 'Certificado de Retención IVA',
    CERTIFICADO_RETENCION_FUENTE_RTE = 'Certificado de Retención en la fuente (RTE)',
    CERTIFICADO_INDUSTRIA_COMERCIO = 'Certificado de Industria y Comercio (ICA)'
}