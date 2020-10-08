import React, { createContext, useState, useEffect } from 'react';
import * as auth from '../services/auth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(['', -1]);

    useEffect(() => {
        function loadStorageData() {
            const storagedUser = (
                localStorage.getItem('@RWAuth:user') ?
                localStorage.getItem('@RWAuth:user') :
                sessionStorage.getItem('@RWAuth:user')
            );
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

        if (response[0].data.user) {
            setUser(response[0].data.user);
            if (response[1] === "false") {
                sessionStorage.setItem('@RWAuth:user', JSON.stringify(response[0].data.user));
            }
            else {
                localStorage.setItem('@RWAuth:user', JSON.stringify(response[0].data.user));
            }
            setMessage(['Usuário logado com sucesso!', response[0].data.status]);
        }
        else {
            setMessage([response[0].data.error, response[0].data.status]);
        }
    }

    function signOut() {
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
        setMessage(['Usuário deslogado com sucesso!', 200]);
    }

    return (
        <AuthContext.Provider value={
            {
                signed: !!user,
                user,
                loading,
                message,
                setMessage,
                signIn,
                signOut
            }
        }>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;