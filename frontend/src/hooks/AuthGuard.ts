import { useNavigate } from 'react-router-dom';
import { useEffect, JSX } from 'react';
import api from '../services/api';

const AuthGuard = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
  
    useEffect(() => {
      api.get('/protected', { withCredentials: true })
        .catch(() => navigate('/login')); // '/'
    }, [ navigate ]);
  
    return children;
}

export default AuthGuard;