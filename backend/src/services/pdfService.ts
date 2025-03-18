import PDFDocument from 'pdfkit-table';
import path from 'path';
import { retainerData, certificateToTypeFile, month, bimesters, typeFileToCertificate } from '../utils/constantes';
import { UserService } from './userService';
import FilesExcels from '../models/filesExcelsModel';
import dayjs from 'dayjs';
import { IUserDetailsExcel } from '../interfaces/interface';
import { NotFoundError } from '../utils/errors';
import { Certificate, TypeFile } from '../utils/enums';
import { ICertificateOptions } from '../interfaces/interface';
import sequelize from '../config/database';
import { FilesExcelsDetails } from './fileDetailsService';

export class PDFDocumentServices {
    static async certificateGeneration(nit: number, year: number, typeCertificate: string, period: string, res: any): Promise<void> {
        
        try {
            
            const { message, details } = await this.getUserCertificateDetails( nit, year, typeCertificate, period );
            
            if ( !details ) {
                throw new NotFoundError( message );
            }

            console.log("Este es el resultado del result5", details);


            // Crear documento PDF
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50}
            });

            // Configurar cabeceras para el PDF (antes de pipe)
            // Indica que el contenido de la respuesta es un archivo adjunto que el navegador debe descargar en lugar de mostrarlo directamente.
            res.setHeader('Content-Disposition', 'attachment; filename="certificado.pdf"');
            // Indica que el contenido de la respuesta es un archivo PDF.
            res.setHeader('Content-Type', 'application/pdf');

            // Conectar el flujo al cliente (enviar PDF directamente al cliente)
            doc.pipe(res);

            const pageWidth = doc.page.width;
            const pageHeight = doc.page.height;

            const logoPath =  path.join( process.cwd(), 'src', 'utils', 'img', 'logoCompanyCesar.jpg' );

            // Evento para agregar el marco en cada nueva página
            doc.on('pageAdded', () => {
                doc.rect( 25, 25, pageWidth - 50, pageHeight - 50 ).strokeColor('black').lineWidth( 1 ).stroke();
            });

            // Dibujar un marco negro alrededor de la pagina 
            doc.rect( 25, 25, pageWidth - 50, pageHeight - 50 ).strokeColor('black').lineWidth( 1 ).stroke();

            // Calcular coordenadas para centrar el logo
            const logoWidth = 150;
            const logoX = ( pageWidth - logoWidth ) / 2;
            // Logo y título

            doc.image( logoPath, logoX, 27 , { width: logoWidth });

            // x:vertical osea al lado
            // y: horizontal osea para subir

            doc.rect( 25, 68, 545, 0 ).strokeColor('black').lineWidth( 1 ).stroke();
            // 50 es el mejor para CERTIFICADO DE RETENCIÓN EN LA FUENTE DE INDUSTRIA Y COMERCIO
            doc.moveDown( 5 )
                .fontSize( 18 )
                .font('Times-Bold')
                .text('CERTIFICADO DE RETENCIÓN EN LA FUENTE DE INDUSTRIA Y COMERCIO', 50, 80, {
                    align: 'center'
                });

        
            doc.moveDown( 5 )
                .fontSize( 14 )
                .font('Times-Bold')
                .text('IDENTIFICACIÓN DEL RETENEDOR', 50, 140, {
                    align: 'center'
                });

            doc.moveDown( 1 );
            doc.y += doc.currentLineHeight() * 0.5;
            // Identificación del retenedor
            retainerData.forEach(data => {
                doc.fontSize(10).font('Helvetica').text(data.label, { continued: true });
                doc.fontSize(10).font('Times-Bold').text(data.value);
                doc.moveDown(1.5);
            });

            doc.rect( 25, 315, 545, 0 ).strokeColor('black').lineWidth( 1 ).stroke();

            doc.font('Times-Bold').moveDown( 45 )
            .fontSize( 14 )
            .text('IDENTIFICACIÓN DE LA PERSONA O ENTIDAD A QUIEN SE PRACTICÓ LA RETENCIÓN', 50, 330, {
                align: 'center'
            });

            doc.rect( 25, 370, 545, 0 ).strokeColor('black').lineWidth( 1 ).stroke();

            doc.moveDown( 2 );

            const user2 = details[0];
            const fileDetailsNameCompany = user2['FileDetails.nameCompany'];
            const fileDetailsNit = user2['nit'];
            const fileDetailsNameConcept = user2['FileDetails.nameConcept'];
            const fileDetailsDv = user2['FileDetails.dv'];
            const nitAndTpRete = `${fileDetailsNit}-${fileDetailsDv}`;

            const identityOrPersonalData = [
                { label: 'Apellidos y Nombres o Razón Social...: ', value: fileDetailsNameCompany },
                { label: 'NIT......................................................: ', value: nitAndTpRete },
                { label: 'Concepto de la Retención...................: ', value: fileDetailsNameConcept } 
            ];

            identityOrPersonalData.forEach( data => {
                doc.fontSize( 10 ).font('Helvetica').text( data.label, { continued: true })
                .font( data.label.includes('Concepto de la Retención...................: ') ? 'Helvetica-Bold' : 'Helvetica' )
                .text( data.value );
                
                doc.moveDown(1);

            });

            doc.moveDown( 2 );

            const rows = details.map( row => [
                row['FileDetails.FilesExcel.period'], // PERIODO
                row['FileDetails.nameConcept'], // CONCEPTO
                Number( row['FileDetails.base']).toLocaleString('es-ES'),
                Number( row['FileDetails.valueRetained'] ).toLocaleString('es-ES')
            ]);

            const totalWithholdingBase = details[0]['FileDetails.Total_base_retencion'];
            const totalRetainedValue = details[0]['FileDetails.Total_valor_retenido'];

            rows.push(["", "", parseInt( totalWithholdingBase ).toLocaleString('es-ES'), parseInt( totalRetainedValue ).toLocaleString('es-ES')]);
            
            const tableData2 = {
                headers: [
                    { label: 'PERIODO', align: 'center' , headerAlign: 'center'}, 
                    { label: 'CONCEPTO', align: 'center' ,headerAlign: 'center'}, 
                    { label: 'BASE DE RETENCIÓN', align: 'center' ,headerAlign: 'center'}, 
                    { label: 'VALOR RETENIDO', align: 'center' ,headerAlign: 'center'}
                ],
                rows 
            };

            const columnsSize = [125, 125, 125, 125]; // Anchos de columna

            await doc.table(tableData2, {
                width: 500,
                prepareHeader: () => {
                    doc.font('Helvetica').fontSize( 7 );
                    // Dibujar líneas verticales entre las columnas de los encabezados  /467
                    const headerY = doc.y - 4; // Posicion del encabezado
                    const headerHeight = 18; // // Altura del encabezado

                    // Coordenadas iniciales de la tabla
                    const startX = doc.x ; // Ajusta según la posición  de la tabla 

                    // Dibujar lineas verticales entre las columnas 
                    let currentX = startX;

                    const endX = startX + 500; // Ajusta según el ancho de la tabla
                    const headerBottomY = doc.y + 11; // Ajusta el valor según la separación que desees

                    // Línea horizontal en negro superior del encabezado
                    doc.lineWidth( 1 )
                        .strokeColor('black')
                        .moveTo( startX, headerY )
                        .lineTo( endX, headerY )
                        .stroke(); 

                    // Línea horizontal en negro inferior del encabezado
                    doc.lineWidth( 1 )
                        .strokeColor('black')
                        .moveTo( 50, headerBottomY )
                        .lineTo( doc.page.width - 45, headerBottomY )
                        .stroke();
                    
                    // Lineas verticales
                    columnsSize.forEach(( width, _ ) => {
                        doc.lineWidth( 0.5 ).strokeColor('black')
                            .moveTo( currentX, headerY )
                            .lineTo( currentX, headerY + headerHeight )
                            .stroke();
                        currentX += width;
                    });

                    // Dibujar línea vertical al final de la última columna
                    doc.lineWidth( 0.5 ).strokeColor('black')
                    .moveTo(currentX, headerY)
                    .lineTo(currentX, headerY + headerHeight)
                    .stroke();
        
                //  console.log('doc x', doc.x);
                    return doc;
                },
                prepareRow: ( row, indexColumn, _rectRow, rectCell) => {
                    doc.font('Helvetica').fontSize( 7 );

                    // Row: Información de la fila actual.
                    // IndexColumn: Índice de la columna actual dentro de la fila.
                    // RectRow: Información del rectángulo que abarca toda la fila.
                    // rectCell: Información del rectángulo que delimita la celda actual, con propiedades x, y, width, height.

                    // Verificar si es la última fila (TOTAL)
                    const isTotalRow = row[0]?.trim().toUpperCase() === ''; // Verificar que la primera columna sea 'TOTAL'

                    if ( isTotalRow && indexColumn === 0) {
                        // Para la fila TOTAL, aumentar el ancho de la primera celda para que ocupe ambas columnas
                        doc.text( row[0]= 'TOTAL' , rectCell!.x, rectCell!.y + 4, {
                            width: columnsSize[0] + columnsSize[1], // Fusión de ambas columnas (PERIODO y CONCEPTO)
                            align: 'center',
                            baseline: 'top',

                        });
                    }
                    if (rectCell && rectCell.x !== undefined && rectCell.y !== undefined &&
                        rectCell.width !== undefined && rectCell.height !== undefined ) {
                        
                        const { x, y, width, height } = rectCell;
                        
                    //    console.log('Esto es x', x);
                        // 🔹 Dibuja líneas verticales correctamente con `columnsSize`
                        let currentX = x; // Inicia en el margen izquierdo de la tabla
                        columnsSize.forEach(( colWidth, i ) => {
                            const columnX = currentX + colWidth; // Calcula la posición exacta de la columna
                            //  Linea vertical derecha de cada celda
                            if (( row[1] && i === 0 || i === 1 || i == 2 || i === 3)) {
                                doc.lineWidth( 0.5 ).strokeColor('black')
                                .moveTo( columnX, y )
                                .lineTo( columnX, y + height )
                                .stroke();
                            }
                            currentX += colWidth;
                        });
                        
                        doc.lineWidth( 0.5 ).strokeColor('black')
                            .moveTo( x, y )
                            .lineTo( x, y + height )
                            .stroke();
                        // 🔹 Dibujar la línea vertical derecha de cada celda
                        doc.lineWidth(0.5).strokeColor('black')
                            .moveTo(x + width, y)
                            .lineTo(x + width, y + height)
                            .stroke();
                        
                        // 🔹 Dibujar la línea horizontal inferior de la fila
                        if (indexColumn === row.length - 1) {
                            doc.lineWidth(0.5).strokeColor('black')
                                .moveTo(50, y + height)
                                .lineTo(doc.page.width - 45, y + height)
                                .stroke();
                        }

                    }
            
                    // Personalizar texto dentro de la celda
                    return doc;
                }
            });
            //console.log('HOlaaaaa');

            doc.moveDown( 3.5 );

            doc.moveTo( 50, doc.y + 20 )
                .fontSize(6)
                .font('Helvetica')
                .text('Para Efectos de la expedición de certificados a que se refiere el Art. 7 Decreto 380/96, el Art. del Decreto 836/91 preceptúa, que las persona jurídicas, podrán entregar los certificados de retención de la fuente, en forma continua impresa por computador sin necesidad de firma autógrafa. De acuerdo con el Art 10 del D.R. 836/91 los Certificados impresos por computador no requieren firma autógrafa.', { align: 'justify' });

            doc.rect( 40, doc.y + 30 , 515, 10 )
                .fill('#007bff');

            doc.moveDown( 7 ).fillColor('black') 
                .font('Helvetica')
                .moveTo( 50, doc.y + 20 )
                .fontSize( 10 )
                .text('FECHA DE EXPEDICIÓN: ', { continued: true })
                .font('Helvetica-Bold')
                .text( dayjs().format('DD/MM/YYYY') );

            // Llamar a doc.end() al final
            doc.end();

        } catch (error) {
            if ( error instanceof NotFoundError ) {
                throw error;
            }
            throw new Error("Error inesperado al generar el certificado.")
        }
    }

    // Función para obtener las opciones de certificado disponibles GET 
    static async generateOptionsCertificate(): Promise< ICertificateOptions > {
        const years = await FilesExcels.findAll({
            attributes: [
                [
                    sequelize.fn('DISTINCT', sequelize.col('year')), 'year'
                ]
            ],
            order: [['year', 'DESC']],
            raw: true,
        });

        const availebleYears = years.map( ( y ) => y.year );

        return {
            certificates: ["Seleccione un certificado", ...Object.values( Certificate )],
            years: ["Seleccione un año", ...availebleYears ],
            typeFileToCertificate
        }
    }

    // Función para encontrar detalles de un usuario
    static async getUserCertificateDetails (nit: number, year: number, typeCertificate: string, period: string) : Promise<{ message: string, details?: IUserDetailsExcel[], certificateFound: boolean }> {
        const user = await UserService.findByNit(nit);

        if ( !user ) {
            throw new NotFoundError('Usuario no encontrado')
        }
        
        const typeFile = certificateToTypeFile[ typeCertificate as Certificate ];
        console.log('Este es typeFile', typeFile);
        if ( !typeFile ) {
            throw new NotFoundError('Certificado invalido');
        }

        let selectedPeriods = [period];

        if ( period === 'Todos' ) {
            selectedPeriods = typeFile === TypeFile.RTE ? month : bimesters;
        }

        console.log('Este es selectedPeriods:', selectedPeriods );

        // Consulta para extraer los detalles
        const userDetailsExcels = await FilesExcelsDetails.getUserDetails( nit, year, typeFile, selectedPeriods ) as unknown as IUserDetailsExcel[];

        if ( !userDetailsExcels.length ) {
            return { 
                message: `No se encotraron detalles para el usuario con NIT ${nit}`,
                certificateFound: false
            };
        }

        return { 
            message: 'Detalles encontrados',
            certificateFound: true,
            details: userDetailsExcels
        };
    }
}
