export type FormData = {
    password: string;
    newPassword: string;
}

export type FormDataNit = {
    nit: number;
    password: string;
    newPassword: string;
}

export type TUser = {
    nit: number;
    logo: string;
    nameCompany: string;
}

export type TNavbarProps = {
    onLogout: () => void;
    userRole: number;
}

export type TUploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// Estados de búsqueda
export type TSearchStatus = "idle" | 'searching' | 'success' | 'error';