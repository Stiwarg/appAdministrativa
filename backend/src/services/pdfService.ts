import PDFDocument from 'pdfkit-table';
import path from 'path';
import { identityOrPersonalData, retainerData } from '../utils/constantes';
import { UserService } from './userService';
//import { ICell } from '../interfaces/interface';

export class PDFDocumentServices {
    static async certificateGeneration(nit: number, res: any) {
        const user = await UserService.findByNit(nit);

        if (!user) {
            throw new Error('Usuario no encontrado.');
        }

        // Crear documento PDF
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50}
        });

        // Configurar cabeceras para el PDF (antes de pipe)
        res.setHeader('Content-Disposition', 'attachment; filename="certificado.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        // Conectar el flujo al cliente (enviar PDF directamente al cliente)
        doc.pipe(res);

        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        const logoPath =  path.join( process.cwd(), 'src', 'utils', 'img', 'logoCompanyCesar.jpg' );

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

        identityOrPersonalData.forEach( data => {
            doc.fontSize( 10 ).font('Helvetica').text( data.label, { continued: true });
            doc.fontSize( 10 ).font('Helvetica').text( data.value );
            doc.moveDown(1);

        });

        doc.moveDown( 2 );

        const tableData = {
            headers: [
                { label: 'PERIODO', align: 'center' , headerAlign: 'center'}, 
                { label: 'CONCEPTO', align: 'center' ,headerAlign: 'center'}, 
                { label: 'BASE DE RETENCIÓN', align: 'center' ,headerAlign: 'center'}, 
                { label: 'VALOR RETENIDO', align: 'center' ,headerAlign: 'center'}
            ],
            rows: [
                ['SEPTIEMBRE-OCTUBRE', 'SERVICIOS 9.6', '3.000.000', '28.980'],
                ['NOVIEMBRE-DICIEMBRE', 'SERVICIOS 9.6', '77.224.970', '745.988'],
                ['NOVIEMBRE-DICIEMBRE', 'COMERCIO 11.0', '1.915.000', '21.142'],
                ['NOVIEMBRE-DICIEMBRE', 'COMERCIO 11.0', '1.915.000', '21.142'],
                ['NOVIEMBRE-DICIEMBRE', 'COMERCIO 11.0', '1.915.000', '21.142'],
                ['NOVIEMBRE-DICIEMBRE', 'COMERCIO 11.0', '1.915.000', '21.142'],
                ['NOVIEMBRE-DICIEMBRE', 'COMERCIO 11.0', '1.915.000', '21.142'],
                ['NOVIEMBRE-DICIEMBRE', 'COMERCIO 11.0', '1.915.000', '21.142'],
                ['NOVIEMBRE-DICIEMBRE', 'COMERCIO 11.0', '1.915.000', '21.142'],
                ['NOVIEMBRE-DICIEMBRE', 'COMERCIO 11.0', '1.915.000', '21.142'],
                ['NOVIEMBRE-DICIEMBRE', 'COMERCIO 11.0', '1.915.000', '21.142'],
                ['', '', '82.139.970', '796.110']
            ]
        };

        console.log('HOlaaaaa');
        const columnsSize = [125, 125, 125, 125]; // Anchos de columna

        await doc.table(tableData, {
            width: 500,
            prepareHeader: () => {
                doc.font('Helvetica').fontSize( 7 );
                // Dibujar líneas verticales entre las columnas de los encabezados  /467
                const headerY = doc.y - 4; // Posicion del encabezado
                const headerHeight = 18; // // Altura del encabezado

                console.log('esto es doc.y', doc.y);
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
    
                console.log('doc x', doc.x);
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
                    
                    console.log('Esto es x', x);
                    // 🔹 Dibuja líneas verticales correctamente con `columnsSize`
                    let currentX = x; // Inicia en el margen izquierdo de la tabla
                    columnsSize.forEach(( colWidth, i ) => {
                        const columnX = currentX + colWidth; // Calcula la posición exacta de la columna
                        //  Linea vertical derecha de cada celda
                        //console.log(`Fila: ${row[1]}, Columna: ${i}, X: ${columnX}`);  // 🔍 **Depuración**
                        //console.log('Fila actual:', row);
                        //console.log('¿Es TOTAL?', isTotalRow);
                        console.log(`Columna: ${i}, Posición X: ${columnX}, ¿Es TOTAL? ${isTotalRow}`);
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
        console.log('HOlaaaaa');

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
            .text('03/02/2025');

        // Llamar a doc.end() al final
        doc.end();
    }
}
