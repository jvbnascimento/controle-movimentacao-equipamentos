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
	FormGroup,
	Container,
	Row,
	Col
} from 'reactstrap';

import api from '../../../services/api';
import AuthContext from '../../../contexts/auth';

export default function ManagerHeader() {
	const [listTypes, setTypes] = useState([]);
	const [listDepartments, setDepartments] = useState([]);
	const [dropdownDepartments, setDropdownDepartments] = useState(false);
	const [dropdownTypes, setDropdownTypes] = useState(false);
	const { user, message, currentRoleUser, setCurrentRoleUser } = useContext(AuthContext);

	useEffect(() => {
		async function getAllTypes() {
			const response = await api.get('/types');
			const data = response.data;
			setTypes(data);
		}

		getAllTypes();
	}, [message]);

	useEffect(() => {
		async function getAllDepartments() {
			const response = await api.get('/departments');
			const data = response.data;
			setDepartments(data);
		}

		getAllDepartments();
	}, [message]);

	const toggleDepartments = () => {
		setDropdownDepartments(!dropdownDepartments)
	};
	const toggleTypes = () => {
		setDropdownTypes(!dropdownTypes)
	};

	const handlecurrentRoleUser = (e) => {
		setCurrentRoleUser(e.target.value);

		localStorage.getItem('@currentRole:user') ?
			localStorage.setItem('@currentRole:user', JSON.stringify(e.target.value)) :
			sessionStorage.setItem('@currentRole:user', JSON.stringify(e.target.value))
	}

	return (
		<div className="height_header">
			<Navbar className="
					bg_color_verde_zimbra_no_effect
					no_padding
					height_header
				"
			>
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
		</div>
	);
}