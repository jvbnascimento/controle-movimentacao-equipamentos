import React, { useContext } from 'react';
import { Container, Spinner } from 'reactstrap';

import AuthContext from '../contexts/auth';

import AdminAuthRoutes from './admin.auth.routes';
import ManagerAuthRoutes from './manager.auth.routes';
import AppRoutes from './app.routes';

export default function Routes() {
	const { signed, loading, currentRoleUser } = useContext(AuthContext);

	if (loading) {
		return (
			<Container fluid={true} className="height_content center">
				<Spinner color="secondary" />
			</Container>
		);
	}

	if (signed) {
		if (currentRoleUser) {
			if (currentRoleUser === 'ADMINISTRADOR') {
				return <AdminAuthRoutes />
			}
			else if (currentRoleUser === 'GERENTE') {
				return <ManagerAuthRoutes />
			}
		}
	}
	
	return <AppRoutes />

}