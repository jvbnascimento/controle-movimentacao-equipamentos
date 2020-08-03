import React from 'react';

import DefaultLayout from './containers/DefaultLayout';

import ListMovement from './pages/Home';
import Hardware from './pages/Hardware';
import EditHardware from './pages/EditHardware';

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
			</Switch>
		</Router>
	);
}
