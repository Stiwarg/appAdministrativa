export const logError = ( message: string, error?: unknown ) => {
    if ( import.meta.env.VITE_ENV === "development") {
        console.error( message, error );
    }
}

export const logInfo = ( message: string, data?: unknown ) => {
    if ( import.meta.env.VITE_ENV === "development" ) {
        console.log( message, data );
    }
}

export const logWarn = ( message: string, data?: unknown ) => {
    if ( import.meta.env.VITE_ENV === "development" ) {
        console.warn( message, data );
    }
}