import React from 'react';

import DefaultLayout from './containers/DefaultLayout';

import ListMovement from './pages/Home';
import Hardware from './pages/Hardware';
import EditHardware from './pages/EditHardware';
import CreateHardware from './pages/CreateHardware';
import ListByCategory from './pages/ListByCategory';
import Movements from './pages/Movements';
import CreateMovement from './pages/CreateMovement';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export default function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact>
					<DefaultLayout container={<ListMovement />} />
				</Route>

				<Route path="/hardware" exact>
					<DefaultLayout container={<Hardware />} />
				</Route>

				<Route path="/hardware/edit/:heritage" exact>
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
			</Switch>
		</Router>
	);
}
