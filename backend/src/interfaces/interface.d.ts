import { Certificate, TypeFile, TypePeriod } from "../utils/enums";
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { typeFileToCertificate } from '../utils/constantes';

// -------------  INTERFACES DE LOS MODELOS  ------------- //
// Se va colocar los 'id' de los modelos de manera opcional ya que estos se generan automaticamente 
export interface IUser {
    id?: number; 
    nit: number;
    password: string;
    companyId: number;
    rolId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IFindByNit {
    nit: number;
}

export interface IRol {
    id?:number;
    nameRol: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IFileExcel {
    id?:number;
    typeFile: TypeFile;
    nameFile: string;
    empresaId: number;
    year: number;
    period: TypePeriod;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IFileDetails {
    id?: number;
    filesExcelsId: number; // id del modelo FilesExcelsModel
    tpRete: number;
    userId: number;
    dv: number; 
    nameCompany: string; // Razon social
    nameConcept: string; // Nombre de concepto
    base: number; // Base
    valueRetained: number; // Valor retenido
    percentage: number; // Porcentaje
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICompany {
    id?: number;
    nameCompany: string;
    logo: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICertificate {
    id?: number;
    userId: number;
    companyId: number;
    typeFile:  TypeFile;
    archivoPdf: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// -------------  INTERFACES DEL SISTEMA  ------------- //

export interface ILogin {
    nit: number;
    password: string;
}

export interface IUpdatePassword {
    nit: number,
    newPassword: string,
    password: string
}

// Este es para post
export interface ICertificateRequest {
    nit: number,
    typeFile: Certificate,
    year: number,
    period: string;
}

export interface ICertificateMyOwnUser {
    typeFile: Certificate,
    year: number,
    period: string
}

// Este es get
export interface ICertificateQueryParams {
    nit: string;  // Se recibe como string en la URL, luego se convierte a número
    year: string;
    typeFile: Certificate;
    period: string;
}

export interface ICompanyName {
    nameCompany: string
}

export interface IFileInput {
    nameFile: string;
    empresaId: number;
    period: TypePeriod;
    typeFile: TypeFile;
    year: number;
}

export interface ICell {
    x: number;
    y: number;
    width: number,
    height: number;
}

export interface IUserDetailsExcel {
    nit: string,
    "FileDetails.nameConcept": string;
    'FileDetails.nameCompany': string;
    "FileDetails.base": number;
    "FileDetails.valueRetained": number;
    "FileDetails.Total_base_retencion": string;
    "FileDetails.Total_valor_retenido": string;
    "FileDetails.FilesExcel.period": string;
    "FileDetails.dv": string;
}

export interface ICertificateOptions {
    certificates: string[];
    years: ( string | number )[];
    typeFileToCertificate: Record< Certificate, TypePeriod[] >;
}

export interface IUserCompanyInfo {
    nit: number;
    logo: string;
    name_company: string;
}

// -------------  INTERFACES DEL TIPO GLOBAL EXPRESS  ------------- //

export interface ICustomJwtPayload extends JwtPayload {
    id: number;
    nit: number;
    companyId?: number;
    rolId: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: ICustomJwtPayload
        }
    }
}

// -------------  INTERFACES DE LA BASE DE DATOS  ------------- //
export interface IDbConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    dbPort: number; 
}

export interface IJwtConfig {
    secretKey: string;
    expiresIn: string;
    refreshTokenExpiresIn: string;
}

export interface IConfig {
    port: string,
    frotendUrl: string,
    backendUrl: string,
    db: IDbConfig,
    jwt: IJwtConfig
}

// -------------  INTERFAZ DE LA CONFIGURACIÓN DE MULTER  ------------- //
export interface IMulterConfigOptions {
    destinationPath: string;
    allowedMimeTypes: string[];
    maxFileSizeMB: number;
}
