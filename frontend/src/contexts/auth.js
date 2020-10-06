import React, { createContext, useState, useEffect } from 'react';
import * as auth from '../services/auth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function loadStorageData() {
            const storagedUser = localStorage.getItem('@RWAuth:user');
            // const storagedToken = localStorage.getItem('@RWAuth:token');

            if (storagedUser) {
                setUser(JSON.parse(storagedUser));
                setLoading(false);
            }
            else {
                setLoading(false);
            }
        }

        loadStorageData();
    }, []);

    async function signIn(data) {
        const response = await auth.singIn(data);
        // console.log(response)

        if (response) {
            setUser(response.user);

            localStorage.setItem('@RWAuth:user', JSON.stringify(response.user));
            // localStorage.setItem('@RWAuth:token', response.token);
        }
    }

    function signOut() {
        localStorage.clear();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={
            {
                signed: !!user,
                user,
                loading,
                signIn,
                signOut
            }
        }>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;