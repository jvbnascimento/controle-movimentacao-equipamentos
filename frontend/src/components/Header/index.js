import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';

import {
	Navbar,
	Nav,
	NavItem,
	NavLink,
	Dropdown,
	DropdownItem,
	DropdownToggle,
	DropdownMenu,
	NavbarText
} from 'reactstrap';

import './index.css'

import api from '../../services/api';

import { Link } from 'react-router-dom';

export default function Header() {
	const [listTypes, setTypes] = useState([]);

	useEffect(() => {
		async function getAllTypes() {
			const response = await api.get('/types');
			const data = response.data;
			setTypes(data);
		}

		getAllTypes();
	}, []);

	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggle = () => setDropdownOpen(!dropdownOpen);

	return (
		<div className="height_header">
			<Navbar className="bg_color_verde_zimbra no_padding">
				<Nav className='mr_auto font_color_white'>
					<NavItem className="bg_color_verde_escuro_zimbra padding_all_20 border_only_right">
						<Link className="font_size_title font_color_white" to="/">Sistema</Link>
					</NavItem>

					<NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1">
						<Link className="padding_all_20 font_color_white_hover" to="/hardware">Equipamentos</Link>
					</NavItem>

					<NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1">
						<NavLink className="padding_all_20 font_color_white_hover" href="#">Movimentações</NavLink>
					</NavItem>

					<Dropdown className="center bg_color_verde_zimbra_hover margin_left_right_1" nav isOpen={dropdownOpen} toggle={toggle}>
						<DropdownToggle className="padding_all_20 font_color_white_hover" nav caret>
							Tipos
          				</DropdownToggle>

						<DropdownMenu className="bg_color_verde_zimbra no_padding">
							{listTypes !== undefined ?
								listTypes.map(element => {
									return (
										<DropdownItem className="bg_color_verde_zimbra_hover no_padding" key={element.id}>
											<NavItem className="no_padding">
												<NavLink className="font_color_white_hover" href="#">{element.name}</NavLink>
											</NavItem>
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

					<NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1">
						<NavLink className="padding_all_20 font_color_white_hover center" href="#">Usuários</NavLink>
					</NavItem>

					<NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1">
						<NavLink className="padding_all_20 font_color_white_hover center" href="#">Sair</NavLink>
					</NavItem>
				</Nav>

				<NavbarText className="text-right padding_all_20 center"> Nome do usuário Logado </NavbarText>
			</Navbar>
		</div>
	);
}