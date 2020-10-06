import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import DefaultLayout from '../containers/DefaultLayout';

import ListMovement from '../pages/Home';
import Hardware from '../pages/Hardware';
import EditHardware from '../pages/EditHardware';
import CreateHardware from '../pages/CreateHardware';
import ListByCategory from '../pages/ListByCategory';
import Movements from '../pages/Movements';
import CreateMovement from '../pages/CreateMovement';
import EditMovement from '../pages/EditMovement';
import Department from '../pages/Department';

export default function AuthRoutes() {
    return (
        <Router>
			<Switch>
				<Route path="/" exact>
					<DefaultLayout container={<ListMovement />} />
				</Route>

				<Route path="/hardware" exact>
					<DefaultLayout container={<Hardware />} />
				</Route>

				<Route path="/hardware/edit/:id" exact>
					<DefaultLayout container={<EditHardware />} />
				</Route>

				<Route path="/hardware/create" exact>
					<DefaultLayout container={<CreateHardware />} />
				</Route>

                <Route path="/hardware/:category" exact>
					<DefaultLayout container={<ListByCategory />} />
				</Route>

                <Route path="/movements" exact>
					<DefaultLayout container={<Movements />} />
				</Route>

                <Route path="/movement/create" exact>
					<DefaultLayout container={<CreateMovement />} />
				</Route>

                <Route path="/movement/edit/:id" exact>
					<DefaultLayout container={<EditMovement />} />
				</Route>

                <Route path="/department/:name" exact>
					<DefaultLayout container={<Department />} />
				</Route>
			</Switch>
		</Router>
    );
};