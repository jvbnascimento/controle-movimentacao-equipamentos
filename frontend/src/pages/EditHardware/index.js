import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Container, Row, Col, Button } from 'reactstrap';

// import './index.css';

import api from '../../services/api';

// import { Link } from 'react-router-dom';

export default function EditHardware() {
	const hardware_id = useParams();

	const [hardware, setHardware] = useState([]);
	const [types, setTypes] = useState([]);

	useEffect(() => {
		async function getHardware() {
			const response = await api.get(`/hardwares/${hardware_id.heritage}`);
			const data = await response.data;

			setHardware(data);
		}

		getHardware();
	}, [hardware_id.heritage]);

	useEffect(() => {
		async function getAllTypes() {
			const response = await api.get('/types');
			const data = await response.data;

			setTypes(data);
		}

		getAllTypes();
	}, []);

	async function updateHardware(newHardware) {
		const {
			id,
			heritage,
			description,
			brand,
			warranty,
			has_office,
			auction,
			date_auction,
		} = newHardware;

		const type_id = newHardware.category.id;
		const department_id = newHardware.belongs.id;

		const new_data = {
			id,
			heritage,
			description,
			brand,
			warranty,
			has_office,
			auction,
			date_auction,
			type_id,
			department_id
		}

		const response = await api.put(`/hardwares/${id}`, new_data);
		const data = await response.data;

		setHardware([data]);
	};

	function handleHeritage(newHeritage) {
		hardware[0].heritage = newHeritage;
	}
	function handleDescription(newDescription) {
		hardware[0].description = newDescription;
	}
	function handleBrand(newBrand) {
		hardware[0].brand = newBrand;
	}
	function handleWarranty(newWarranty) {
		hardware[0].warranty = newWarranty;
	}
	function handleHasOffice(newHasOffice) {
		hardware[0].has_office = newHasOffice;
	}
	function handleCategory(newCategory) {
		const newType = types.filter(type => type.id === parseInt(newCategory));

		hardware[0].category.id = newType[0].id;
	}

	return (
		<Container>
			<Row>
				<Col>
					<Form>
						{
							hardware[0] !== undefined ?
								<>
									<FormGroup key={hardware[0].id}>
										<Label for="labelHeritage">Tombamento</Label>
										<Input
											type="text"
											name="heritage"
											id="labelHeritage"
											placeholder="Tombamento"
											defaultValue={hardware[0].heritage}
											onChange={(event) => {handleHeritage(event.target.value)}}
										/>

										<Label for="labelDescription">Descrição</Label>
										<Input
											type="text"
											name="description"
											id="labelDescription"
											placeholder="Descrição"
											defaultValue={hardware[0].description}
											onChange={(event) => {handleDescription(event.target.value)}}
										/>

										<Label for="labelBrand">Marca</Label>
										<Input
											type="text"
											name="brand"
											id="labelBrand"
											placeholder="Marca"
											defaultValue={hardware[0].brand}
											onChange={(event) => {handleBrand(event.target.value)}}
										/>

										<Label for="labelWarranty">Garantia</Label>
										<Input
											type="text"
											name="warranty"
											id="labelWarranty"
											placeholder="Garantia"
											defaultValue={hardware[0].warranty}
											onChange={(event) => {handleWarranty(event.target.value)}}
										/>

										<Label for="labelHas_office">Tem office</Label>
										<Input
											type="text"
											name="has_office"
											id="labelHas_office"
											placeholder="Garantia"
											defaultValue={hardware[0].has_office}
											onChange={(event) => {handleHasOffice(event.target.value)}}
										/>

										<Label for="labelCategory">Tipo</Label>
										<Input
											type="select"
											name="category"
											id="labelCategory"
											defaultValue={hardware[0].category.id}
											onChange={(event) => {handleCategory(event.target.value)}}
										>
											{
												types !== undefined ?
													types.map(element => {
														return (
															<option
																key={element.id}
																value={element.id}
															>{element.name}</option>
														);
													}) : ''
											}
										</Input>

										<Button color="success" onClick={() => { updateHardware(hardware[0]) }}>Salvar</Button>
									</FormGroup>
								</>
								: ''
						}
					</Form>
				</Col>
			</Row>
		</Container >
	);
}