import React, { createContext, useState, useEffect } from 'react';
import * as auth from '../services/auth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [currentRoleUser, setCurrentRoleUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState(['', -1]);
	const colorMessage = {
		200: "success",
		201: "success",
		204: "success",
		404: "danger",
		400: "danger"
	}

	useEffect(() => {
		function loadStorageData() {
			const storagedUser = (
				localStorage.getItem('@RWAuth:user') ?
					localStorage.getItem('@RWAuth:user') :
					sessionStorage.getItem('@RWAuth:user')
			);
			const storageCurrentRoleUser = (
				localStorage.getItem('@currentRole:user') ?
					localStorage.getItem('@currentRole:user') :
					sessionStorage.getItem('@currentRole:user')
			);
			// const storagedToken = localStorage.getItem('@RWAuth:token');

			if (storagedUser && storageCurrentRoleUser) {
				setUser(JSON.parse(storagedUser));
				setCurrentRoleUser(JSON.parse(storageCurrentRoleUser));
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
			setCurrentRoleUser(response[0].data.user.roles[0].name);
			if (response[1] === "false") {
				sessionStorage.setItem('@RWAuth:user', JSON.stringify(response[0].data.user));
				sessionStorage.setItem("@currentRole:user", JSON.stringify(response[0].data.user.roles[0].name));
			}
			else {
				localStorage.setItem('@RWAuth:user', JSON.stringify(response[0].data.user));
				localStorage.setItem("@currentRole:user", JSON.stringify(response[0].data.user.roles[0].name));
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
		setCurrentRoleUser(null);
		setMessage(['Usuário deslogado com sucesso!', 200]);
	}

	return (
		<AuthContext.Provider value={
			{
				signed: !!user,
				user,
				currentRoleUser,
				setCurrentRoleUser,
				loading,
				message,
				setMessage,
				signIn,
				signOut,
				colorMessage
			}
		}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthContext;