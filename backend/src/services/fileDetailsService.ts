import FilesDetails from '../models/filesDetailsModel';
import FilesExcels from '../models/filesExcelsModel';
import { TFoundUser, TNewFileDetails } from '../types/type';
import { UserService } from '../services/userService';
import { TypeFile,TypePeriod } from '../utils/enums';
import Users from '../models/UsersModel';
import { Op, Sequelize } from 'sequelize';

export class FilesExcelsDetails {
    
    // Hay dos funciones que son iguales una funciona con la estabilidad de agregar los datos pero se demora mas y hay otra función que es veloz e inserta los miles de registros rapidamente pero puede causar problemas de concurrecnia si no se maneja bien 

    /**
     * Lee los datos de un archivo Excel y los almacena en la base de datos de manera eficiente (Estabilidad).
     *  - Este evita consulta innecesarias a la base de datos usando un canche de usuarios.
     *  - Crea los usuarios si no existen antes de insertar los datos.
     *  - Insertar los registros fila por fila en la base de datos ( mas lento que bulkCreate() ).
     *  - Guarda cada registro insertado en un array fileDetailsResults para devolverlos al final
     */    
    static async readExcel2 ( excelData: TNewFileDetails[], fileExcelId: number, companyId: number ): Promise< TNewFileDetails[] > {

        try {
            
            // Cache de usuarios para evitar hacer multiples consultas por el mismo NIT
            const usersCache = new Map< number, TFoundUser >();

            // Arreglo donde se guardarán los detalles de los archivos.
            const fileDetailsResults: TNewFileDetails[] = [];

            for (const row of excelData ) {
                let user = usersCache.get( row.userId ); // Revisar si ya está en cache

                if ( !user ) {
                    // Buscar o crear el usuario antes de insetar la fila
                    user = await UserService.findOrCreateEmployeeBy( row.userId, companyId );
                    usersCache.set( row.userId, user ); // Guardalo en cache para futuras consultas.

                    console.log(`Usuario procesando con NIT ${ row.userId }: `, user);
                }

                // Insertar fila en la base de datos
                const fileDetail = await FilesDetails.create({
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
                fileDetailsResults.push( fileDetail );
            }

            return fileDetailsResults as TNewFileDetails[];
        } catch (error) {
            throw new Error('Error al guardar los datos del excel en FileDetails ' + error );
        }
    }

    /**
     * Lee los datos de un archivo Excel y los almacena en la base de datos de manera eficiente (Velocidad).
     *  - Este evita consulta innecesarias a la base de datos usando un canche de usuarios.
     *  - Crea los usuarios si no existen antes de insertar los datos.
     *  - Guardar los registros en la base de datos en batch para mejorar la velocidad.
     */
    static async readExcel ( excelData: TNewFileDetails[], fileExcelId: number, companyId: number, period: TypePeriod, typeFile: TypeFile, year: number ): Promise< TNewFileDetails[] > {

        try {
            // Guarda los usuarios ya consultados para evitar repetir busquedas
            const usersCache = new Map< number, TFoundUser >();
            // Acumula los datos que serán insertadas en la base de datos en un solo bulkCreate()
            const bulkInsertData: TNewFileDetails[] = [];

            // Obtener todos los registros existentes en una sola consulta 
            const existingRecords = await FilesDetails.findAll({
                include: [{
                    model: FilesExcels,
                    required: true,
                    where: {
                        year: year,
                        period: period,
                        typeFile: typeFile
                    },
                    attributes: ['year','period','typeFile']
                }],
                attributes: ['userId', 'base', 'valueRetained']
            });

            console.log('Registros existentes: ', existingRecords.map( r => ({
                userId: r.userId,
                base: r.base,
                valueRetained: r.valueRetained,
            })));

            // Convertir a Set para búsqueda rápida
            const existingSet = new Set(
                existingRecords.map( r => 
                    `${ r.userId }-${ r.base }-${ r.valueRetained }-${ year }-${ period }-${ typeFile }`
                )
            );

            console.log('Claves en existingSet:');
            for ( const key of existingSet ) {
                console.log('⏺️', key);
            }

            for (const row of excelData ) {
                // Si el usuario ya está en caché, lo usa directamente , asi evita consultas multiples
                let user = usersCache.get( row.userId );
                
                if ( !user ) {
                    // Se utiliza la función findOrCreateEmployeeBy para buscar o crear el usuario en la base de datos.
                    user = await UserService.findOrCreateEmployeeBy( row.userId, companyId );
                    // Se guarda en caché para no repetir la consulta en la siguiente iteración
                    usersCache.set( row.userId, user );    
                }


                const recordKey = `${ user.id }-${ row.base }-${ row.valueRetained }-${ year }-${ period }-${ typeFile }`;

                console.log('verificando registro:', recordKey );

                // Si no existe en el Set, agregarlo al array para insertarlo
                if ( !existingSet.has( recordKey ) ) {
                  console.log('Nuevo registro, se agregará:', recordKey);

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
                    existingSet.add( recordKey );
                } else {
                    console.log(`❌ Registro duplicado: userId=${row.userId}, base=${row.base}, valueRetained=${row.valueRetained}`);
                }

            }

            // Inserta todos los datos en una sola consulta SQL lo que es mucho mas rapido 
            if ( bulkInsertData.length > 0 ) {
                console.log('Insetando registros en batch:', bulkInsertData.length);
                await FilesDetails.bulkCreate( bulkInsertData );
            }
            //const insertedRecords = await FilesDetails.bulkCreate( bulkInsertData );
            //console.log('✔️ Insertados correctamente:', insertedRecords.length);
            // Se devuelve los registros insertados
            return bulkInsertData;
        } catch (error) {
            throw new Error('Error al guardar los datos del Excel en FileDetails:' + error );
        }
    }

    // Consulta para tomar detalles
    static async getUserDetails (nit: number, year: number, typeFile: string, selectedPeriods: string[]) {
        return await Users.findAll({
            where: { nit },
            attributes: ["nit"],
            include: [
              {
                model: FilesDetails,
                required: true,
                attributes: [
                  "nameConcept",
                  "nameCompany",
                  "dv",
                  "base",
                  "valueRetained",
                  [
                    Sequelize.literal(
                      `SUM( value_retained ) OVER ( PARTITION BY FileDetails.user_id )`
                    ),
                    "Total_valor_retenido"
                  ],
                  [
                    Sequelize.literal(
                      `SUM( base ) OVER ( PARTITION BY FileDetails.user_id )`
                    ),
                    "Total_base_retencion"
                  ],
                ],
                include: [
                  {
                    model: FilesExcels,
                    required: true,
                    attributes: ["period"],
                    where: {
                      typeFile,
                      year,
                      period: { [Op.in]: selectedPeriods },
                    },
                  },
                ],
              },
            ],
            order: [
              [
                Sequelize.literal(
                  `FIELD(\`FileDetails->FilesExcel\`.\`period\`, 'Enero-Febrero', 'Marzo-Abril', 'Mayo-Junio', 'Julio-Agosto', 'Septiembre-Octubre', 'Noviembre-Diciembre')`
                ),
                "ASC",
              ],
            ],
            raw: true,
          });
        }
}