import React, { useContext } from 'react';
import { Container, Spinner } from 'reactstrap';

import AuthContext from '../contexts/auth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

export default function Routes() {
    const { signed, loading } = useContext(AuthContext);
    
    if (loading) {
        return (
            <Container fluid={true} className="height_content center">
                <Spinner color="secondary" />
            </Container>
        );
    }

    return signed ? <AppRoutes /> : <AuthRoutes />
}