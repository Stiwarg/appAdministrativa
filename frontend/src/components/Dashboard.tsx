import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Nabvar';
import {  Routes, Route, Navigate, Link } from "react-router-dom";
import UserInfoCard from './UserInfoCard';
import CompanyManagement from './CompanyManagement';
import ChangePasswordAdminForm from './ChangePasswordAdmin';
import UploadFilesForm from './UploadFiles';
import DownloadCertificatesForm from './DownloadCertificates';
import logo from '../img/logoCompanyCesar.jpg';
import api from '../services/api';
import { TUser } from '../types/types'; 
import ChangePasswordForm from './ChangePassword';
import { logInfo } from '../utils/logger';
import DownloadCertificatesFormEmployee from './DownloadCertificatesEmployee';

const Dashboard = () => {

    
  const navigate = useNavigate();
  const [ user, setUser ] = useState< TUser | null >(null);
  const [ userRole, setUserRole ] = useState< number >();

  useEffect(() => {
    api.get('/protected', { withCredentials: true })
      .then( (res) => {
        logInfo('Datos recibidos del backend:', res.data );
        logInfo('Usuarios recibido:', res.data.user );
        setUser( {
          nit: res.data.company.nit,
          logo: res.data.company.logo,
          nameCompany: res.data.company.nameCompany
        } );
        setUserRole( res.data.user.rolId );
        
      })
      .catch(() => navigate('/')); // Si no está autenticado, redirige al login
  }, [ navigate ]);

  const handleLogout = () => {
    api.post('/logout', {}, { withCredentials: true })
      .then(() => navigate('/'))
      .catch( err => console.error('Error al cerrar sesión', err ))
  }

  return (
    <>
      <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
          { /* Contenedor principal */}
          <div className="bg-white w-full max-w-6xl p-4 sm:p-6 md:p-8 rounded-lg shadow-md">

            { /* Logo del dueño del aplicativo */ }
            <div className='flex justify-center mb-6 md:mb-8'>
              <Link to="/dashboard"> 
                <img 
                  src={ logo } 
                  alt="logo" 
                  className=' w-full max-w-xs sm:w-80 h-20 sm:h-28 flex items-center justify-center text-gray-600 text-xs sm:text-sm text-center p-2 sm:p-4' 
                />
              </Link>
            </div>

            { /* Barra de navegación */}
            <Navbar onLogout={ handleLogout } userRole={ userRole! }/>


            { /* Panel de Información */}
            {/* Rutas internas */}
            <Routes>
              {/* Ruta por defecto: index */}
              <Route index element = {
                <UserInfoCard 
                  logoSrc={ user?.logo || "https://via.placeholder.com/150" }
                  companyName={ user ? user.nameCompany : "N/A "}  
                  nit= { user ? user.nit : 0 }
                />
               } 
              />
              { userRole === 1 && <Route path="/GestionEmpresas" element={< CompanyManagement />} /> }
              <Route path="/cambiarPassword" element={ userRole === 1 ? < ChangePasswordAdminForm /> : <ChangePasswordForm />} />
              { userRole === 1 && <Route path="/cargarArchivos" element={< UploadFilesForm />} />}
              <Route path="/descargarCertificados" element={ userRole === 1 ? < DownloadCertificatesForm /> : <DownloadCertificatesFormEmployee/>} />
              <Route path="*" element={ <Navigate to="/dashboard" />} />

            </Routes>

          </div>
      </div>
    </>
  )

}

export default Dashboard;