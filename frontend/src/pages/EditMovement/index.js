import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
	Form,
	FormGroup,
	Label,
	Input,
	Container,
	Row,
	Col,
	Button,
	ListGroup,
	ListGroupItem,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from 'reactstrap';
import { BsPlusCircleFill } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';

import api from '../../services/api';

export default function EditHardware() {
	const movement_id = useParams();

	const [movement, setMovement] = useState([]);
	const [users, setUsers] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [listHardwares, setListHardwares] = useState([]);

	const [date_movement, setDateMovement] = useState('');
	const [origin_department_id, setOriginDepartmentId] = useState(1);
	const [destination_department_id, setDestinationDepartmentId] = useState(1);
	const [responsible_id, setResponsibleId] = useState(1);
	const [hardwares, setHardwares] = useState([]);

	const [modal, setModal] = useState(false);
	const [movementToDelete, setMovementToDelete] = useState(-1);

	const history = useHistory();

	// USE EFFECTS
	useEffect(() => {
		async function getMovement() {
			const response = await api.get(`/movements/${movement_id.id}`);
			const data = await response.data;

			const new_date = format_date(data.date_movement);

			setDateMovement(new_date);
			setOriginDepartmentId(data.origin_department_id);
			setDestinationDepartmentId(data.destination_department_id);
			setResponsibleId(data.responsible_id);
			setListHardwares(data.hardwares);

			setMovement(data);
		}
		getMovement();
	}, [movement_id.id]);

	useEffect(() => {
		async function getAllHardwares() {
			const response = await api.get(`/hardwares/department/${origin_department_id}`);
			const data = await response.data;

			setHardwares(data);
		}

		getAllHardwares();
	}, [origin_department_id]);

	useEffect(() => {
		async function getAllUsers() {
			const response = await api.get('/users');
			const data = await response.data;

			setUsers(data);
		}

		getAllUsers();
	}, []);

	useEffect(() => {
		async function getAllDepartments() {
			const response = await api.get('/departments');
			const data = await response.data;

			setDepartments(data);
		}

		getAllDepartments();
	}, []);

	// OTHERS FUNCTIONS
	function format_date(date) {
		if (date !== undefined) {
			const data_auxiliar = date.split("T");

			return data_auxiliar[0];
		}
		return;
	}

	const toggle = (e) => {
		setModal(!modal)

		if (toggle) {
			setMovementToDelete(e.target.value);
		}
		else {
			setMovementToDelete(-1);
		}
	};

	async function updateMovement() {
		const id_hardwares = listHardwares.map(element => { return { "id": element.id } });

		const data = {
			date_movement,
			responsible_id: parseInt(responsible_id),
			destination_department_id: parseInt(destination_department_id),
			origin_department_id: parseInt(origin_department_id),
			hardwares: id_hardwares
		}

		await api.put(`/movements/${movement.id}`, data);

		history.push('/movements');
	};

	function handleDateMovement(e) {
		setDateMovement(e.target.value);
	}
	function handleResponsible(e) {
		setResponsibleId(parseInt(e.target.value));
	}
	function handleDestinationDepartment(e) {
		setDestinationDepartmentId(parseInt(e.target.value));

	}
	function handleOriginDepartment(e) {
		setOriginDepartmentId(parseInt(e.target.value));

		const destinationDepartmentId = departments.filter(department => {
			return department && department.id !== parseInt(e.target.value);
		});

		setDestinationDepartmentId(destinationDepartmentId[0].id);
	}

	function addHardware(e) {
		e.preventDefault();

		if (parseInt(e.target.hardwares.value) !== 0) {
			async function getHardware(index) {
				const hardware = await api.get(`/hardwares/${index}`);

				const newListHardwares = [...listHardwares, hardware.data];

				setListHardwares(newListHardwares);
			}

			getHardware(e.target.hardwares.value);
		}
	}

	function removeHardware(e) {
		e.preventDefault();

		if (parseInt(e.target.value) !== 0) {
			async function getHardware(index) {

				const newListHardwares = listHardwares.filter((element) => {
					return element.id !== parseInt(index)
				});

				setListHardwares(newListHardwares);
			}

			getHardware(e.target.value);
		}
	}

	async function deleteMovement() {
		await api.delete(`/movements/${movementToDelete}`);

		history.push('/movements');
	}

	return (
		<div className="margin_top_10">
			{
				movement !== undefined &&
				<Container className="margin_bottom_30" fluid={true}>
					<Row className="text-right">
						<Col>
							<Button
								onClick={toggle}
								className="font_color_verde_zimbra_hover bg_color_transparent no_border index_2"
								title="Deletar movimentação"
								value={movement.id}
							>
								<RiDeleteBin6Line className="index_1" size="40" />
							</Button>
						</Col>
					</Row>
				</Container>
			}

			<Container className="center">
				<Row className="no_padding width_60">
					<Col>
						<h3 className="text-center margin_top_bottom_20">Editar dados da movimentação {movement.id}</h3>
						{
							movement !== undefined ?
								<Row key={movement.id}>
									<Col>
										<Label className="margin_top_10" for="labelDateMovement">Data da movimentação</Label>
										<Input
											type="date"
											name="dateMovement"
											id="labelDateMovement"
											placeholder="Data da movimentação"
											value={date_movement}
											onChange={handleDateMovement}
											className="margin_bottom_20"
										/>

										<Label className="margin_top_10" for="labelResponsible">Responsável pela movimentação</Label>
										<Input
											type="select"
											name="responsible"
											id="labelResponsible"
											value={responsible_id}
											onChange={handleResponsible}
											className="margin_bottom_20"
										>
											{
												users !== undefined && users.length !== 0 ?
													users.map(element => {
														return (
															<option
																key={element.id}
																value={element.id}
															>{element.name}</option>
														);
													})
													: ''
											}
										</Input>

										<Label className="margin_top_10" for="labelNextDepartment">Departamento destino</Label>
										<Input
											type="select"
											name="destination_department_id"
											id="labelNextDepartment"
											value={destination_department_id}
											onChange={handleDestinationDepartment}
											className="margin_bottom_20"
											required
										>
											{
												departments !== undefined && departments.length !== 0 ?
													departments.filter(department => {
														return department && department.id !== origin_department_id;
													}).map(element => {
														return (
															<option
																key={element.id}
																value={element.id}
															>{element.name} | {element.boss}</option>
														);
													}) : ''
											}
										</Input>

										<Label className="margin_top_10" for="labelPreviousDepartment">Departamento original</Label>
										<Input
											type="select"
											name="origin_department_id"
											id="labelPreviousDepartment"
											value={origin_department_id}
											onChange={handleOriginDepartment}
											className="margin_bottom_20"
										>
											{
												departments !== undefined && departments.length !== 0 ?
													departments.map(element => {
														return (
															<option
																key={element.id}
																value={element.id}
															>{element.name} | {element.boss}</option>
														);
													})
													: ''
											}
										</Input>


										<Form onSubmit={addHardware}>
											<FormGroup>
												<Label className="margin_top_10" for="labelAddHardware">Adicionar equipamentos</Label>
												<Row className="center_between">
													<Col sm="9">
														<Input
															type="select"
															name="hardwares"
															id="labelAddHardware"
															className="margin_bottom_20"
														>
															<option
																key={0}
																value={0}
															>SELECIONAR EQUIPAMENTO</option>
															{
																hardwares !== undefined && hardwares.length !== 0 ?
																	hardwares.filter(({ id: id1 }) => !listHardwares.some(({ id: id2 }) => (id1 === id2))).map(element => {
																		return (
																			<option
																				key={element.id}
																				value={element.id}
																			>{element.heritage.replace("-", "")} | {element.description}</option>
																		);
																	})
																	: ''
															}
														</Input>
													</Col>

													<Col sm="auto">
														<Button
															className="
																bg_color_transparent
																font_color_verde_zimbra_hover
																no_border
															"
															title="Adicionar equipamento"
														><BsPlusCircleFill size="30" /></Button>
													</Col>
												</Row>
											</FormGroup>
										</Form>


										{
											listHardwares !== undefined && listHardwares.length !== 0 ?
												<>
													<Label className="margin_top_10" for="labelDepartment">Lista de equipamentos para movimentação</Label>
													<ListGroup>
														<div className="max_height_100">
															{
																listHardwares.map(hardware => {
																	return (
																		<ListGroupItem key={hardware.id}>
																			<Row>
																				<Col sm="auto" className="center border_only_right">{hardware.heritage}</Col>
																				<Col>{hardware.description}</Col>
																				<Col sm="auto" className="center">
																					<Button
																						value={hardware.id}
																						onClick={removeHardware}>Remover</Button>
																				</Col>
																			</Row>
																		</ListGroupItem>
																	)
																})
															}
														</div>
													</ListGroup>
												</>
												: ''
										}

										<Row>
											<Col className="center margin_top_bottom_20">
												<Button
													className="
													margin_left_right_20
													bg_color_verde_zimbra
												"
													onClick={updateMovement}
												>Editar</Button>
												<Button
													color="secondary"
													className="margin_left_right_20"
													onClick={() => { history.goBack() }}
												>Voltar</Button>
											</Col>
										</Row>
									</Col>
								</Row>
								: ''
						}
					</Col>
				</Row>
			</Container>

			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>Deletar movimentação</ModalHeader>
				<ModalBody>
					Tem certeza que desejar <strong className="font_color_danger">DELETAR</strong> esta movimentação?
				</ModalBody>
				<ModalFooter>
					<Button color="danger" onClick={deleteMovement}>Sim</Button>
					<Button className="bg_color_verde_zimbra" onClick={toggle}>Cancelar</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}