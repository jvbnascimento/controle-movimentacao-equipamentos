import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import DefaultLayout from '../containers/DefaultLayout';

import ListMovement from '../pages/admin/Home';
import Hardware from '../pages/admin/Hardware';
import EditHardware from '../pages/admin/EditHardware';
import CreateHardware from '../pages/admin/CreateHardware';
import ListByCategory from '../pages/admin/ListByCategory';
import Movements from '../pages/admin/Movements';
import CreateMovement from '../pages/admin/CreateMovement';
import EditMovement from '../pages/admin/EditMovement';
import Department from '../pages/admin/Department';
import Users from '../pages/admin/Users';
import CreateUser from '../pages/admin/CreateUser';
import Logout from '../pages/Logout';

export default function AdminAuthRoutes() {
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

				<Route path="/hardware/create" exact>
					<DefaultLayout>
						<CreateHardware />
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

				<Route path="/users" exact>
					<DefaultLayout>
						<Users />
					</DefaultLayout>
				</Route>

				<Route path="/user/create" exact>
					<DefaultLayout>
						<CreateUser />
					</DefaultLayout>
				</Route>

				<Route path="/logout" exact>
					<Logout />
				</Route>
			</Switch>
		</Router>
	);
};