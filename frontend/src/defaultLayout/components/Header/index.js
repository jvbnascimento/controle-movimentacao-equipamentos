import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState } from 'react';
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

const Header = (props) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggle = () => setDropdownOpen(!dropdownOpen);

	const tipos = props.tipos;

	return (
		<div className="height_header">
			<Navbar className="bg_color_verde_zimbra no_padding">
				<Nav className='mr_auto font_color_white'>
					<NavItem className="bg_color_verde_escuro_zimbra padding_all_10 border_only_right">
						<NavLink className="font_size_title font_color_white" href="#">Sistema</NavLink>
					</NavItem>

					<NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1">
						<NavLink className="padding_all_20 font_color_white_hover" href="#">Equipamentos</NavLink>
					</NavItem>


					<NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1">
						<NavLink className="padding_all_20 font_color_white_hover" href="#">Movimentações</NavLink>
					</NavItem>

					<Dropdown className="center bg_color_verde_zimbra_hover margin_left_right_1" nav isOpen={dropdownOpen} toggle={toggle}>
						<DropdownToggle className="padding_all_20 font_color_white_hover" nav caret>
							Tipos
          				</DropdownToggle>

						<DropdownMenu className="bg_color_verde_zimbra no_padding">
							{tipos !== undefined ?
								tipos.map(element => {
									return (
										<DropdownItem className="bg_color_verde_zimbra_hover" key={element.id}>
											<NavItem className="no_padding">
												<NavLink className="font_color_white_hover" href="#">{element.name}</NavLink>
											</NavItem>
										</DropdownItem>)
								}) : ''
							}
							<DropdownItem divider />
							<DropdownItem className="bg_color_verde_zimbra_hover">
								<NavItem>
									<NavLink className="font_color_white_hover" href="#">CRIA ITEM</NavLink>
								</NavItem>
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>

					<NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1">
						<NavLink className="padding_all_20 font_color_white_hover padding_all_10 center" href="#">Usuários</NavLink>
					</NavItem>
				</Nav>

				<NavbarText className="text-right padding_all_20 center"> Nome do usuário Logado </NavbarText>
			</Navbar>
		</div>
	);
}

export default Header;