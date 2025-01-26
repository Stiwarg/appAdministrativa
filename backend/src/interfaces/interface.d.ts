import { TypeFile } from "../utils/enums";
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

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
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IFileDetails {
    id?: number;
    filesExcelsId: number;
    tpRete: string;
    nitRegister: number;
    dv: number;
    nameCompany: string;
    nameConcept: string;
    base: number;
    valueRetained: number;
    percentage: number;
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

export interface IFindByNit {
    nit: number
}

export interface ICompanyName {
    nameCompany: string
}

export interface IFileInput {
    nameFile: string;
    empresaId: number;
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
    db: IDbConfig,
    jwt: IJwtConfig
}

// -------------  INTERFAZ DE LA CONFIGURACIÓN DE MULTER  ------------- //
export interface IMulterConfigOptions {
    destinationPath: string;
    allowedMimeTypes: string[];
    maxFileSizeMB: number;
}
