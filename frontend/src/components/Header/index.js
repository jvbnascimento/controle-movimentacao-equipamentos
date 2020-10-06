import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import {
	Navbar,
	Nav,
	NavItem,
	NavLink,
	Dropdown,
	DropdownItem,
	DropdownToggle,
	DropdownMenu,
    NavbarText,
    Button
} from 'reactstrap';

import api from '../../services/api';
import AuthContext from '../../contexts/auth';

export default function Header() {
    const [listTypes, setTypes] = useState([]);
    const [listDepartments, setDepartments] = useState([]);
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen2, setDropdownOpen2] = useState(false);
    
    const {signOut, user} = useContext(AuthContext);

    const history = useHistory();

	useEffect(() => {
		async function getAllTypes() {
			const response = await api.get('/types');
			const data = response.data;
			setTypes(data);
		}

		getAllTypes();
    }, []);

	useEffect(() => {
		async function getAllDepartments() {
			const response = await api.get('/departments');
			const data = response.data;
			setDepartments(data);
		}

		getAllDepartments();
    }, []);
    
    const toggle = () => setDropdownOpen(!dropdownOpen);
    const toggle2 = () => setDropdownOpen2(!dropdownOpen2);

    function signOutBackLogin() {
        signOut();
        history.push('/');
    }

	return (
		<div className="height_header">
			<Navbar className="bg_color_verde_zimbra_no_effect no_padding height_header">
				<Nav className='font_color_white'>
					<NavItem className="bg_color_verde_escuro_zimbra padding_all_20 border_only_right height_header">
						<Link className="font_size_title font_color_white height_header" to="/">Sistema</Link>
					</NavItem>

					<NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header">
						<Link className="center padding_all_20 font_color_white_hover height_header" to="/hardware">Equipamentos</Link>
					</NavItem>

					<NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header">
						<Link className="center padding_all_20 font_color_white_hover height_header" to="/movements">Movimentações</Link>
					</NavItem>

					<Dropdown className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header" nav isOpen={dropdownOpen} toggle={toggle}>
						<DropdownToggle className="center padding_all_20 font_color_white_hover height_header" nav caret>
							Departamentos
          				</DropdownToggle>

						<DropdownMenu className="bg_color_verde_zimbra no_padding max_height_500">
							{listDepartments !== undefined ?
								listDepartments.map(element => {
									return (
										<DropdownItem className="bg_color_verde_zimbra_hover no_padding" key={element.id}>
											<Link
                                                className="center_vertical font_color_white_hover"
                                                to={`/department/${element.name.replace("/", "-")}`}
                                            >
												<NavItem
                                                    className="padding_all_10"
                                                >{element.name}</NavItem>
                                            </Link>
										</DropdownItem>)
								}) : ''
							}
							<DropdownItem divider className="no_margin" />
							<DropdownItem className="bg_color_verde_zimbra_hover no_padding">
								<NavItem>
									<NavLink className="font_color_white_hover" href="#">CRIA ITEM</NavLink>
								</NavItem>
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>

					<Dropdown className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header" nav isOpen={dropdownOpen2} toggle={toggle2}>
						<DropdownToggle className="center padding_all_20 font_color_white_hover height_header" nav caret>
							Tipos
          				</DropdownToggle>

						<DropdownMenu className="bg_color_verde_zimbra no_padding">
							{listTypes !== undefined ?
								listTypes.map(element => {
									return (
										<DropdownItem className="bg_color_verde_zimbra_hover no_padding" key={element.id}>
											<Link
                                                className="center_vertical font_color_white_hover"
                                                to={`/hardware/${element.name}`}
                                            >
												<NavItem
                                                    className="padding_all_10"
                                                >{element.name}</NavItem>
                                            </Link>
										</DropdownItem>)
								}) : ''
							}
							<DropdownItem divider className="no_margin" />
							<DropdownItem className="bg_color_verde_zimbra_hover no_padding">
								<NavItem>
									<NavLink className="font_color_white_hover" href="#">CRIA ITEM</NavLink>
								</NavItem>
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>

					<NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header">
						<NavLink className="center padding_all_20 font_color_white_hover center height_header" href="#">Usuários</NavLink>
					</NavItem>

					<NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header">
						<Button
                            className="center padding_all_20 font_color_white_hover center height_header"
                            onClick={signOutBackLogin}
                        >
                            Sair
                        </Button>
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
                    <strong>{user.name}</strong>
                </NavbarText>
			</Navbar>
		</div>
	);
}