import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../contexts/auth';

export default function Logout() {
    const { signOut } = useContext(AuthContext);
    const history = useHistory();
    
    useEffect(() => {
		function logout() {
			signOut();
            history.push('/');
		}

		logout();
    }, [signOut, history]);
    
    return null;
}