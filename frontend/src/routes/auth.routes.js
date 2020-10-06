import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from '../pages/Login';

export default function AuthRoutes() {
    return (
        <Router>
			<Switch>
                <Route path="/" exact>
                    <Login />
                </Route>
            </Switch>
        </Router>
    )
};