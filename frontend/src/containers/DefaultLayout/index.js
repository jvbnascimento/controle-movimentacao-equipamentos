import React, { useContext } from 'react';

import AdminHeader from '../../components/admin/Header';
import ManagerHeader from '../../components/manager/Header';
import Footer from '../../components/Footer';

import AuthContext from '../../contexts/auth';

export default function DefaultLayout(props) {
	const { currentRoleUser } = useContext(AuthContext);

	if (currentRoleUser === 'ADMINISTRADOR') {
		return (
			<>
				<AdminHeader />
				{props.children}
				<Footer />
			</>
		);
	}
	else if (currentRoleUser === 'GERENTE') {
		return (
			<>
				<ManagerHeader />
				{props.children}
				<Footer />
			</>
		);
	}
}