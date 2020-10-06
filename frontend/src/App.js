import React from 'react';

import Routes from './routes'
import { AuthProvider } from './contexts/auth';

export default function App() {
	return (
        <AuthProvider>
            <Routes />
        </AuthProvider>
	);
}
