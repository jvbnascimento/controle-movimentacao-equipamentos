import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import {
	Navbar,
	Nav,
	NavItem,
	Dropdown,
	DropdownItem,
	DropdownToggle,
	DropdownMenu,
	NavbarText,
	Input,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	FormGroup,
	FormFeedback,
	Label,
	Button,
	Container,
	Row,
	Col
} from 'reactstrap';

import api from '../../../services/api';
import AuthContext from '../../../contexts/auth';

export default function AdminHeader() {
	const [listTypes, setTypes] = useState([]);
	const [listDepartments, setDepartments] = useState([]);
	const [dropdownDepartments, setDropdownDepartments] = useState(false);
	const [dropdownTypes, setDropdownTypes] = useState(false);
	const [modalCreateDepartment, setModalCreateDepartment] = useState(false);
	const [modalCreateCategory, setModalCreateCategory] = useState(false);
	const [departmentName, setDepartmentName] = useState('');
	const [departmentBoss, setDepartmentBoss] = useState('');
	const [verifyDepartmentName, setVerifyDepartmentName] = useState(false);
	const [verifyDepartmentBoss, setVerifyDepartmentBoss] = useState(false);
	const [categoryName, setCategoryName] = useState('');
	const [verifyCategoryName, setVerifyCategoryName] = useState(true);
	const { user, message, setMessage, currentRoleUser, setCurrentRoleUser } = useContext(AuthContext);

	useEffect(() => {
		async function getAllTypes() {
			const response = await api.get('/types');
			const data = response.data;
			setTypes(data);

			setCategoryName('');
			setVerifyCategoryName(false);
		}

		getAllTypes();
	}, [message]);

	useEffect(() => {
		async function getAllDepartments() {
			const response = await api.get('/departments');
			const data = response.data;
			setDepartments(data);

			setDepartmentName('');
			setDepartmentBoss('');
			setVerifyDepartmentName(false);
			setVerifyDepartmentBoss(false);
		}

		getAllDepartments();
	}, [message]);

	useEffect(() => {
		async function getDepartment() {
			if (departmentName !== '') {
				const response = await api.get(`/departments/verify_name/${departmentName.replace("/", "-")}`);
				const data = response.data;

				setVerifyDepartmentName(data.name_exists);
			}
		}

		getDepartment();
	}, [departmentName]);

	useEffect(() => {
		async function getCategory() {
			if (categoryName !== '') {
				const response = await api.get(`/types/verify_name/${categoryName}`);
				const data = response.data;

				setVerifyCategoryName(data.name_exists);
			}
		}

		getCategory();
	}, [categoryName]);

	const toggleDepartments = () => {
		setDropdownDepartments(!dropdownDepartments)
	};
	const toggleTypes = () => {
		setDropdownTypes(!dropdownTypes)
	};

	const toggleModalCreateDepartment = () => {
		setModalCreateDepartment(!modalCreateDepartment);
	}

	const toggleModalCreateCategory = () => {
		setModalCreateCategory(!modalCreateCategory);
	}

	const handleCategoryName = (e) => {
		if (e.target.value === '') {
			setVerifyCategoryName(false);
		}

		setCategoryName(e.target.value);
	}

	const handleDepartmentName = (e) => {
		if (e.target.value === '') {
			setVerifyDepartmentName(false);
		}

		setDepartmentName(e.target.value);
	}

	const handleDepartmentBoss = (e) => {
		const validDepartmentBoss = e.target.value;

		if (/^\S.*/gm.exec(validDepartmentBoss)) {
			setVerifyDepartmentBoss(true);
		}
		else {
			setVerifyDepartmentBoss(false);
		}

		setDepartmentBoss(e.target.value);
	}

	const cancelCreationDepartment = () => {
		setDepartmentName('');
		setDepartmentBoss('');
		setVerifyDepartmentName(false);
		setVerifyDepartmentBoss(false);
		toggleModalCreateDepartment();
	}

	const validCreateDepartment = () => {
		if (!verifyDepartmentName && departmentName !== '' && verifyDepartmentBoss) {
			return true;
		}
		return false;
	}

	const createDepartment = async () => {
		if (validCreateDepartment()) {
			const new_data = {
				name: departmentName,
				boss: departmentBoss
			}

			const response = await api.post(`departments/`, new_data);

			if (response.data.status === 200) {
				setMessage(['Departamento criado com sucesso', 200]);
				toggleModalCreateDepartment();
			}
			else {
				setMessage([response.error, response.status]);
				toggleModalCreateDepartment();
			}
		}
		else {
			setMessage(["Existem campos não preenchidos corretamente", 400]);
			toggleModalCreateDepartment();
		}
	}

	const cancelCreationCategory = () => {
		setCategoryName('');
		setVerifyCategoryName(false);
		toggleModalCreateCategory();
	}

	const validCreateCategory = () => {
		if (!verifyCategoryName && categoryName !== '') {
			return true;
		}
		return false;
	}

	const createCategory = async () => {
		if (validCreateCategory()) {
			const new_data = {
				name: categoryName
			}

			const response = await api.post(`types/`, new_data);

			if (response.data.status === 201) {
				setMessage(['Categoria criada com sucesso', 201]);
				toggleModalCreateCategory();
			}
			else {
				setMessage([response.error, response.status]);
				toggleModalCreateCategory();
			}
		}
		else {
			setMessage(["Existem campos não preenchidos corretamente", 400]);
			toggleModalCreateCategory();
		}
	}

	const handlecurrentRoleUser = (e) => {
		setCurrentRoleUser(e.target.value);

		localStorage.getItem('@currentRole:user') ?
			localStorage.setItem('@currentRole:user', JSON.stringify(e.target.value)) :
			sessionStorage.setItem('@currentRole:user', JSON.stringify(e.target.value))
	}

	return (
		<div className="height_header">
			<Navbar className="bg_color_verde_zimbra_no_effect no_padding height_header">
				<Nav className='font_color_white'>
					<NavItem
						className="
							bg_color_verde_escuro_zimbra
							padding_all_20
							border_only_right
							height_header
						"
					>
						<Link
							className="
								font_size_title
								font_color_white
								height_header
							"
							to="/"
						>
							Sistema
						</Link>
					</NavItem>

					<NavItem
						className="
							center
							bg_color_verde_zimbra_hover
							margin_left_right_1
							height_header
						"
					>
						<Link
							className="
								center
								padding_all_20
								font_color_white_hover
								height_header
							"
							to="/hardware"
						>
							Equipamentos
						</Link>
					</NavItem>

					<NavItem
						className="
							center
							bg_color_verde_zimbra_hover
							margin_left_right_1
							height_header
						"
					>
						<Link
							className="
								center
								padding_all_20
								font_color_white_hover
								height_header
							"
							to="/movements"
						>
							Movimentações
						</Link>
					</NavItem>

					<Dropdown
						className="
							center
							bg_color_verde_zimbra_hover
							margin_left_right_1
							height_header
						"
						nav
						isOpen={dropdownDepartments}
						toggle={toggleDepartments}
					>
						<DropdownToggle
							className="
								center
								padding_all_20
								font_color_white_hover
								height_header
							"
							nav
							caret
						>
							Departamentos
          				</DropdownToggle>

						<DropdownMenu
							className="
								bg_color_verde_zimbra
								no_padding
								max_height_500
							"
						>
							<DropdownItem
								className="
                                            bg_color_verde_zimbra_hover
                                            no_padding
								        "
							>
								<Link
									className="
                                                center_vertical
                                                font_color_white_hover
                                            "
									to="#"
									onClick={toggleModalCreateDepartment}
								>
									<NavItem
										className="padding_all_10"
									>
										CRIAR DEPARTAMENTO
									        </NavItem>
								</Link>
							</DropdownItem>

							<DropdownItem divider className="no_margin" />
							{
								listDepartments !== undefined ?
									listDepartments.map(element => {
										return (
											<DropdownItem
												className="
												bg_color_verde_zimbra_hover
												no_padding
											"
												key={element.id}
											>
												<Link
													className="
													center_vertical
													font_color_white_hover
												"
													to={`/department/${element.name.replace("/", "-")}`}
												>
													<NavItem
														className="padding_all_10"
													>
														{element.name}
													</NavItem>
												</Link>
											</DropdownItem>)
									})
									: ''
							}
						</DropdownMenu>
					</Dropdown>

					<Dropdown
						className="
							center
							bg_color_verde_zimbra_hover
							margin_left_right_1
							height_header
						"
						nav
						isOpen={dropdownTypes}
						toggle={toggleTypes}
					>
						<DropdownToggle
							className="
								center
								padding_all_20
								font_color_white_hover
								height_header
							"
							nav
							caret
						>
							Tipos
          				</DropdownToggle>

						<DropdownMenu
							className="
								bg_color_verde_zimbra
								no_padding
							"
						>

							<DropdownItem
								className="
                                            bg_color_verde_zimbra_hover
                                            no_padding
                                        "
							>
								<Link
									className="
                                                center_vertical
                                                font_color_white_hover
                                            "
									to="#"
									onClick={toggleModalCreateCategory}
								>
									<NavItem
										className="padding_all_10"
									>
										CRIAR CATEGORIA
                                            </NavItem>
								</Link>
							</DropdownItem>
							<DropdownItem divider className="no_margin" />
							{
								listTypes !== undefined ?
									listTypes.map(element => {
										return (
											<DropdownItem
												className="
												bg_color_verde_zimbra_hover
												no_padding
											"
												key={element.id}
											>
												<Link
													className="
													center_vertical
													font_color_white_hover
												"
													to={`/hardware/${element.name}`}
												>
													<NavItem
														className="padding_all_10"
													>
														{element.name}
													</NavItem>
												</Link>
											</DropdownItem>)
									})
									: ''
							}

						</DropdownMenu>
					</Dropdown>
					<NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header">
						<Link
							className="
                                        center
                                        padding_all_20
                                        font_color_white_hover
                                        center
                                        height_header
                                    "
							to={'/users'}
						>
							Usuários
                                </Link>
					</NavItem>

					<NavItem className="
							center
							bg_color_verde_zimbra_hover
							margin_left_right_1
							height_header
						"
					>
						<Link
							className="
								center
								padding_all_20
								font_color_white_hover
								center
								height_header
							"
							to="/logout"
						>
							Sair
                        </Link>
					</NavItem>
				</Nav>

				<NavbarText
					className="
                        text-right
                        padding_all_20
                        center
                        height_header
                    "
				>
					<Container className="center">
						<Row>
							<Col className="center">
								<strong>{user.name}</strong>
							</Col>

							<Col sm="auto" className="center no_padding">
								<FormGroup className="no_margin">
									<Input
										type="select"
										name="select"
										id="rolesUser"
										value={currentRoleUser}
										onChange={handlecurrentRoleUser}
									>
										{
											user.roles.map(element => {
												return (<option key={element.id}>{element.name}</option>);
											})
										}
									</Input>
								</FormGroup>
							</Col>
						</Row>
					</Container>
				</NavbarText>
			</Navbar>

			<Modal isOpen={modalCreateDepartment} toggle={toggleModalCreateDepartment}>
				<ModalHeader toggle={toggleModalCreateDepartment}>
					Criar departamento
                </ModalHeader>

				<ModalBody>
					<FormGroup>
						<Label>Departamento</Label>
						{
							!verifyDepartmentName ?
								departmentName !== '' ?
									<>
										<Input
											value={departmentName}
											onChange={handleDepartmentName}
											valid
										/>
										<FormFeedback valid>Nome válido</FormFeedback>
									</>
									:
									<>
										<Input
											value={departmentName}
											onChange={handleDepartmentName}
											invalid
										/>
										<FormFeedback>O campo <strong>DEPARTAMENTO</strong> não pode ser vazio.</FormFeedback>
									</>
								:
								<>
									<Input
										value={departmentName}
										onChange={handleDepartmentName}
										invalid
									/>
									<FormFeedback>Já existe um <strong>DEPARTAMENTO</strong> com o nome informado.</FormFeedback>
								</>
						}
					</FormGroup>

					<FormGroup>
						<Label>Responsável</Label>
						{
							verifyDepartmentBoss ?
								<>
									<Input
										value={departmentBoss}
										onChange={handleDepartmentBoss}
										valid
									/>
									<FormFeedback valid>Nome válido</FormFeedback>
								</>
								:
								<>
									<Input
										value={departmentBoss}
										onChange={handleDepartmentBoss}
										invalid
									/>
									<FormFeedback>O campo <strong>RESPONSÁVEL</strong> não pode ser vazio.</FormFeedback>
								</>
						}
					</FormGroup>
				</ModalBody>

				<ModalFooter>
					<Button
						className="bg_color_verde_zimbra"
						onClick={createDepartment}
						disabled={!validCreateDepartment() ? true : false}
					>
						Criar
					</Button>{' '}
					<Button
						color="secondary"
						onClick={cancelCreationDepartment}
					>
						Cancelar
					</Button>
				</ModalFooter>
			</Modal>

			<Modal isOpen={modalCreateCategory} toggle={toggleModalCreateCategory}>
				<ModalHeader toggle={toggleModalCreateCategory}>
					Criar Categoria
                </ModalHeader>

				<ModalBody>
					<FormGroup>
						<Label>Categoria</Label>
						{
							!verifyCategoryName ?
								categoryName !== '' ?
									<>
										<Input
											value={categoryName}
											onChange={handleCategoryName}
											valid
										/>
										<FormFeedback valid>Nome válido</FormFeedback>
									</>
									:
									<>
										<Input
											value={categoryName}
											onChange={handleCategoryName}
											invalid
										/>
										<FormFeedback>O campo <strong>CATEGORIA</strong> não pode ser vazio.</FormFeedback>
									</>
								:
								<>
									<Input
										value={categoryName}
										onChange={handleCategoryName}
										invalid
									/>
									<FormFeedback>Já existe um <strong>CATEGORIA</strong> com o nome informado.</FormFeedback>
								</>
						}
					</FormGroup>
				</ModalBody>

				<ModalFooter>
					<Button
						className="bg_color_verde_zimbra"
						onClick={createCategory}
						disabled={!validCreateCategory() ? true : false}
					>
						Criar
					</Button>{' '}
					<Button
						color="secondary"
						onClick={cancelCreationCategory}
					>
						Cancelar
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}