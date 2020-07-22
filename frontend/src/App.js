import React, { Component } from 'react';

import api from './services/api';

import Header from './defaultLayout/components/Header';
import Footer from './defaultLayout/components/Footer';
import Sistema from './components/content/Sistema';


class App extends Component {
	state = {
		tipos: [],
		movements: [],
	}

	async componentDidMount() {
		const responseTipos = await api.get('/types');
		const responseMovements = await api.get('/movements')

		this.setState({
			tipos: responseTipos.data,
			movements: responseMovements.data,
		});
	}

	render() {
		const { tipos, movements } = this.state;

		return (
			<>
				<Header tipos={tipos.types}/>
				<Sistema movements={movements.movements}/>
				<Footer />
			</>
		);
	}
}

export default App;
