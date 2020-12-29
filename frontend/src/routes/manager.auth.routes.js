import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import DefaultLayout from '../containers/DefaultLayout';

import ListMovement from '../pages/manager/Home';
import Hardware from '../pages/manager/Hardware';
import EditHardware from '../pages/manager/EditHardware';
import ListByCategory from '../pages/manager/ListByCategory';
import Movements from '../pages/manager/Movements';
import CreateMovement from '../pages/manager/CreateMovement';
import EditMovement from '../pages/manager/EditMovement';
import Department from '../pages/manager/Department';
import Logout from '../pages/Logout';

export default function ManagerAuthRoutes() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact>
					<DefaultLayout>
						<ListMovement />
					</DefaultLayout>
				</Route>

				<Route path="/hardware" exact>
					<DefaultLayout>
						<Hardware />
					</DefaultLayout>
				</Route>

				<Route path="/hardware/edit/:id" exact>
					<DefaultLayout>
						<EditHardware />
					</DefaultLayout>
				</Route>

				<Route path="/hardware/:category" exact>
					<DefaultLayout>
						<ListByCategory />
					</DefaultLayout>
				</Route>

				<Route path="/movements" exact>
					<DefaultLayout>
						<Movements />
					</DefaultLayout>
				</Route>

				<Route path="/movement/create" exact>
					<DefaultLayout>
						<CreateMovement />
					</DefaultLayout>
				</Route>

				<Route path="/movement/edit/:id" exact>
					<DefaultLayout>
						<EditMovement />
					</DefaultLayout>
				</Route>

				<Route path="/department/:name" exact>
					<DefaultLayout>
						<Department />
					</DefaultLayout>
				</Route>

				<Route path="/logout" exact>
					<Logout />
				</Route>
			</Switch>
		</Router>
	);
};