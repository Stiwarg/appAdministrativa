import { useEffect, useState } from 'react';
import axios from 'axios';

//  Este hook revisa si el usuario esta autenticado consultando el backend
export const useAuth = () => {
    const [ isAuthenticated, setIsAuthenticated ] = useState< boolean | null >(null);

    useEffect(() => {
        axios.get('"http://localhost:3000/api/protected', { withCredentials: true })
            .then( () => setIsAuthenticated( true ))
            .catch( () => setIsAuthenticated( false )); 
    }, []);

    return isAuthenticated;
}