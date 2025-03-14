import {  FileText, Key, Upload, Download, LogOut  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TNavbarProps } from '../types/types';


const Navbar: React.FC< TNavbarProps > = ({ onLogout, userRole }) => {
    
    const navItems = userRole === 1 
    ? [ 
        { path: "/dashboard/gestionEmpresas", icon: FileText, label: "Gestión de Empresas" },
        { path: "/dashboard/cambiarPassword", icon: Key, label: "Cambiar Contraseña" },
        { path: "/dashboard/cargarArchivos", icon: Upload, label: "Cargar Archivos" },
        { path: "/dashboard/descargarCertificados", icon: Download, label: "Descargar Certificados" }
    ]
    : [
        { path: "/dashboard/cambiarPassword", icon: Key, label: "Cambiar Contraseña" },
        { path: "/dashboard/descargarCertificados", icon: Download, label: "Descargar Certificados" }
    ];
    
    
    return (
        <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-12">
            { navItems.map(({ icon: Icon, label, path } ) => (
                <Link 
                    key={path}
                    to={path}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors whitespace-nowrap text-xs sm:text-sm cursor-pointer"
                >
                    <Icon  className='w-4 h-4 sm:w-5 sm:h-5'/>
                    <span className="font-bold">{ label }</span>
                </Link>
            ))}

            {/* Boton de Cerrar Sesión */}
            <button 
                onClick={ onLogout }
                className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors whitespace-nowrap text-xs sm:text-sm cursor-pointer">
                <LogOut className='w-4 h-4 sm:w-5 sm:h-5'/>
                <span className='font-bold'>Cerrar Sesión</span>
            </button>
        </div>
    );
};

export default Navbar;