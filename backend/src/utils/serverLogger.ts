export const printServerInfo = ( host: string, port: number, mode: string, url?: string ) => {
    console.log(`🚀 Servidor iniciado en modo ${mode.toUpperCase()}`);

    if ( mode === 'production' && url ) {
        console.log(`🌐 Accede a tu app en: ${ url }`);
    } else {
        console.log(`📡 URL local: http://${ host }:${ port }`);
    }
}