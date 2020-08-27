import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroupItem, ListGroup, Pagination, PaginationItem, PaginationLink, NavLink } from 'reactstrap';

import api from '../../services/api';

export default function ListMovement() {
	const [movements, setMovements] = useState([]);

	useEffect(() => {
		async function getAllMovements() {
			const response = await api.get('/users');
			const data = await response.data;

			setMovements(data);
		}

		getAllMovements();
	}, []);

	function format_date(date) {
		const data_auxiliar = date.split("T");
		const data = data_auxiliar[0].split("-");
		const horario = data_auxiliar[1].split(".");
	
		const new_data = data[2] + "/" + data[1] + "/" + data[0];
		const new_horario = horario[0];
	
		return (new_data + " " + new_horario);
    }

	return (
		<div className='height_content'>
			{/* <h1 className="text-center"> Últimas movimentações </h1>
			<ListGroup>
				<Container>
					{
						movements !== undefined ?
							movements.map(element => {
								return (
									<Row
										className="center margin_top_bottom_20"
										key={ element.id }
									>
										<Col xs="8">
											<ListGroupItem>
												<NavLink
													href="#"
													className="font_color_black_hover no_padding"
												>
													<Row>
														<Col
															sm="auto"
															className="border_only_right"
														>{ element.id }</Col>
														<Col sm="auto">{ format_date(element.date_movement) }</Col>
													</Row>
												</NavLink>
											</ListGroupItem>
										</Col>
									</Row>
								)
							}) : 
							<Row
								className="center margin_top_bottom_20"
							>
								<Col xs="8" className="text-center">
									<h3>Ainda não há movimentações</h3>
								</Col>
							</Row>
					}
				</Container>
			</ListGroup>

			<Pagination
				className="margin-top-bottom-10 center"
				aria-label="Page navigation example"
			>
				<PaginationItem>
					<PaginationLink
						className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
						first
						href="#"
					/>
				</PaginationItem>

				<PaginationItem>
					<PaginationLink
						className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
						previous
						href="#"
					/>
				</PaginationItem>

				<PaginationItem>
					<PaginationLink
						className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
						href="#"
					> 1 
					</PaginationLink>
				</PaginationItem>

				<PaginationItem>
					<PaginationLink
						className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
						href="#"
					> 2
					</PaginationLink>
				</PaginationItem>

				<PaginationItem>
					<PaginationLink
						className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
						href="#"
					> 3
					</PaginationLink>
				</PaginationItem>

				<PaginationItem>
					<PaginationLink
						className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
						href="#"
					> 4
					</PaginationLink>
				</PaginationItem>

				<PaginationItem>
					<PaginationLink
						className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
						href="#"
					> 5
					</PaginationLink>
				</PaginationItem>

				<PaginationItem>
					<PaginationLink
						className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
						next
						href="#"
					/>
				</PaginationItem>

				<PaginationItem>
					<PaginationLink
						className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
						last
						href="#"
					/>
				</PaginationItem>
			</Pagination> */}
		</div>
	);
}


// <Row key={element.id}>
								// 	<Col className="border margin-top-bottom-20">
								// 		<Row>
								// 			<Col className="text-center title padding-all-10">Movimentação {element.id}</Col>
								// 		</Row>

								// 		<Row>
								// 			<Col className="padding-all-10">Data da movimentação</Col>
								// 			<Col className="padding-all-10">{element.date_movement}</Col>
								// 		</Row>

								// 		<Row>
								// 			<Col className="padding-all-10">Responsável</Col>
								// 			<Col className="padding-all-10">{element.responsible.name}</Col>
								// 		</Row>

								// 		<Row>
								// 			<Col>
								// 				<Row>
								// 					<Col className="padding-all-10">Departamento de origem</Col>
								// 					<Col className="padding-all-10">{element.previous_department.name}</Col>
								// 					<Col className="padding-all-10">Chefe do setor</Col>
								// 					<Col className="padding-all-10">{element.previous_department.boss}</Col>
								// 				</Row>
								// 				<Row>
								// 					<Col className="padding-all-10">Departamento de destino</Col>
								// 					<Col className="padding-all-10">{element.next_department.name}</Col>
								// 					<Col className="padding-all-10">Chefe do setor</Col>
								// 					<Col className="padding-all-10">{element.next_department.boss}</Col>
								// 				</Row>
								// 			</Col>
								// 		</Row>

								// 		<Row>
								// 			<Col>
								// 				<Row>
								// 					<Col className="text-center title padding-all-10">Equipamentos Movimentados</Col>
								// 				</Row>
								// 				{
								// 				movements[0].hardwares !== undefined ? movements[0].hardwares.map((hardware) => {
								// 					return (
								// 					<Row key={hardware.id_hardware}>
								// 						<Col className="padding-all-10">Descrição</Col>
								// 						<Col className="padding-all-10">{hardware.description}</Col>
								// 					</Row>
								// 					);
								// 				}) : ''
								// 				}
								// 			</Col>
								// 		</Row>
								// 	</Col>
								// </Row>