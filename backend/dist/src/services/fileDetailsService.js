"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesExcelsDetails = void 0;
const filesDetailsModel_1 = __importDefault(require("../models/filesDetailsModel"));
const filesExcelsModel_1 = __importDefault(require("../models/filesExcelsModel"));
const userService_1 = require("../services/userService");
const dayjs_1 = __importDefault(require("dayjs"));
const UsersModel_1 = __importDefault(require("../models/UsersModel"));
const sequelize_1 = require("sequelize");
class FilesExcelsDetails {
    // Hay dos funciones que son iguales una funciona con la estabilidad de agregar los datos pero se demora mas y hay otra función que es veloz e inserta los miles de registros rapidamente pero puede causar problemas de concurrecnia si no se maneja bien 
    /**
     * Lee los datos de un archivo Excel y los almacena en la base de datos de manera eficiente (Estabilidad).
     *  - Este evita consulta innecesarias a la base de datos usando un canche de usuarios.
     *  - Crea los usuarios si no existen antes de insertar los datos.
     *  - Insertar los registros fila por fila en la base de datos ( mas lento que bulkCreate() ).
     *  - Guarda cada registro insertado en un array fileDetailsResults para devolverlos al final
     */
    static async readExcel2(excelData, fileExcelId, companyId) {
        try {
            // Cache de usuarios para evitar hacer multiples consultas por el mismo NIT
            const usersCache = new Map();
            // Arreglo donde se guardarán los detalles de los archivos.
            const fileDetailsResults = [];
            for (const row of excelData) {
                let user = usersCache.get(row.userId); // Revisar si ya está en cache
                if (!user) {
                    // Buscar o crear el usuario antes de insetar la fila
                    user = await userService_1.UserService.findOrCreateEmployeeBy(row.userId, companyId);
                    usersCache.set(row.userId, user); // Guardalo en cache para futuras consultas.
                    console.log(`Usuario procesando con NIT ${row.userId}: `, user);
                }
                // Insertar fila en la base de datos
                const fileDetail = await filesDetailsModel_1.default.create({
                    filesExcelsId: fileExcelId,
                    tpRete: row.tpRete,
                    userId: user.id,
                    dv: row.dv,
                    nameCompany: row.nameCompany,
                    nameConcept: row.nameConcept,
                    base: row.base,
                    valueRetained: row.valueRetained,
                    percentage: row.percentage * 100,
                });
                console.log('Fila insertada correctamente:', fileDetail);
                fileDetailsResults.push(fileDetail);
            }
            return fileDetailsResults;
        }
        catch (error) {
            throw new Error('Error al guardar los datos del excel en FileDetails ' + error);
        }
    }
    /**
     * Lee los datos de un archivo Excel y los almacena en la base de datos de manera eficiente (Velocidad).
     *  - Este evita consulta innecesarias a la base de datos usando un canche de usuarios.
     *  - Crea los usuarios si no existen antes de insertar los datos.
     *  - Guardar los registros en la base de datos en batch para mejorar la velocidad.
     */
    static async readExcel(excelData, fileExcelId, companyId, period, typeFile) {
        try {
            // Guarda los usuarios ya consultados para evitar repetir busquedas
            const usersCache = new Map();
            // Acumula los datos que serán insertadas en la base de datos en un solo bulkCreate()
            const bulkInsertData = [];
            // Obtener todos los registros existentes en una sola consulta 
            const existingRecords = await filesDetailsModel_1.default.findAll({
                include: [{
                        model: filesExcelsModel_1.default,
                        required: true,
                        where: {
                            year: (0, dayjs_1.default)().year(),
                            period: period,
                            typeFile: typeFile
                        },
                        attributes: ['year', 'period', 'typeFile']
                    }],
                attributes: ['userId', 'base', 'valueRetained']
            });
            // Convertir a Set para búsqueda rápida
            const existingSet = new Set(existingRecords.map(r => `${r.userId}-${r.base}-${r.valueRetained}-${(0, dayjs_1.default)().year()}-${period}-${typeFile}`));
            for (const row of excelData) {
                // Si el usuario ya está en caché, lo usa directamente , asi evita consultas multiples
                let user = usersCache.get(row.userId);
                if (!user) {
                    // Se utiliza la función findOrCreateEmployeeBy para buscar o crear el usuario en la base de datos.
                    user = await userService_1.UserService.findOrCreateEmployeeBy(row.userId, companyId);
                    // Se guarda en caché para no repetir la consulta en la siguiente iteración
                    usersCache.set(row.userId, user);
                }
                const recordKey = `${user.id}-${row.base}-${row.valueRetained}-${(0, dayjs_1.default)().year()}-${period}-${typeFile}`;
                // Si no existe en el Set, agregarlo al array para insertarlo
                if (!existingSet.has(recordKey)) {
                    //console.log('Registro no encontrado, agregado:', recordKey );
                    bulkInsertData.push({
                        filesExcelsId: fileExcelId,
                        tpRete: row.tpRete,
                        userId: user.id,
                        dv: row.dv,
                        nameCompany: row.nameCompany,
                        nameConcept: row.nameConcept,
                        base: row.base,
                        valueRetained: row.valueRetained,
                        percentage: row.percentage * 100
                    });
                    // Agregarlo al Set para evitar futuras verificaciones innecesarias 
                    existingSet.add(recordKey);
                }
                else {
                    console.log(`❌ Registro duplicado: userId=${row.userId}, base=${row.base}, valueRetained=${row.valueRetained}`);
                }
            }
            // Inserta todos los datos en una sola consulta SQL lo que es mucho mas rapido 
            if (bulkInsertData.length > 0) {
                await filesDetailsModel_1.default.bulkCreate(bulkInsertData);
            }
            //const insertedRecords = await FilesDetails.bulkCreate( bulkInsertData );
            //console.log('✔️ Insertados correctamente:', insertedRecords.length);
            // Se devuelve los registros insertados
            return bulkInsertData;
        }
        catch (error) {
            throw new Error('Error al guardar los datos del Excel en FileDetails:' + error);
        }
    }
    // Consulta para tomar detalles
    static async getUserDetails(nit, year, typeFile, selectedPeriods) {
        return await UsersModel_1.default.findAll({
            where: { nit },
            attributes: ["nit"],
            include: [
                {
                    model: filesDetailsModel_1.default,
                    required: true,
                    attributes: [
                        "nameConcept",
                        "nameCompany",
                        "dv",
                        "base",
                        "valueRetained",
                        [
                            sequelize_1.Sequelize.literal(`SUM( value_retained ) OVER ( PARTITION BY FileDetails.user_id )`),
                            "Total_valor_retenido"
                        ],
                        [
                            sequelize_1.Sequelize.literal(`SUM( base ) OVER ( PARTITION BY FileDetails.user_id )`),
                            "Total_base_retencion"
                        ],
                    ],
                    include: [
                        {
                            model: filesExcelsModel_1.default,
                            required: true,
                            attributes: ["period"],
                            where: {
                                typeFile,
                                year,
                                period: { [sequelize_1.Op.in]: selectedPeriods },
                            },
                        },
                    ],
                },
            ],
            order: [
                [
                    sequelize_1.Sequelize.literal(`FIELD(\`FileDetails->FilesExcel\`.\`period\`, 'Enero-Febrero', 'Marzo-Abril', 'Mayo-Junio', 'Julio-Agosto', 'Septiembre-Octubre', 'Noviembre-Diciembre')`),
                    "ASC",
                ],
            ],
            raw: true,
        });
    }
}
exports.FilesExcelsDetails = FilesExcelsDetails;
