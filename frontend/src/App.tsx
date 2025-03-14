"use client"
/*import Navbar from './components/Nabvar';
import UserInfoCard from './components/UserInfoCard';
import logo from './img/logoCompanyCesar.jpg';
import CompanyManagement from './components/CompanyManagement';
import UploadFilesForm from './components/UploadFiles';
import DownloadCertificatesForm from './components/DownloadCertificates';
import ChangePasswordAdminForm from './components/ChangePasswordAdmin';*/
import { BrowserRouter as Router , Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import AuthGuard from './hooks/AuthGuard';
import Dashboard from './components/Dashboard';

function App() {
// El * en /dashboard/* permite que Dashboard.tsx maneje sus propias rutas internas.
  return (

    <Router>
      <Routes>
        <Route path='/login' element={ <LoginPage /> } />
        <Route path='/dashboard/*' element={<AuthGuard>< Dashboard /></AuthGuard>}/>
        <Route path='*' element={ < Navigate to="/login" /> } />
      </Routes>
    </Router>
  )
}
export default App