import { TypeFile } from "../utils/enums";


// -------------  INTERFACES DE LOS MODELOS  ------------- //
// Se va colocar los 'id' de los modelos de manera opcional ya que estos se generan automaticamente 
export interface IUser {
    id?: number; 
    nit: number;
    password: string;
    companyId: Number;
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