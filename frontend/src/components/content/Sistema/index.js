import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { Container, Row, Col, ListGroupItem, ListGroup, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import './index.css';

function formatar_data(date) {
    const data_auxiliar = date.split("T");
    const data = data_auxiliar[0].split("-");
    const horario = data_auxiliar[1].split(".");

    const new_data = data[2] + "/" + data[1] + "/" + data[0];
    const new_horario = horario[0];

    return (new_data + " " + new_horario);
}

const Sistema = (props) => {
    const movements = props.movements;

    return (
        <>
            <h1 className="text-center"> Últimas movimentações </h1>
            <ListGroup className='height_content'>
                {
                    movements !== undefined ?
                        movements.map(element => {
                            return (
                                <Container>
                                    <Row className="center">
                                        <Col xs="8">
                                            <ListGroupItem key={element.id}>
                                                <Row>
                                                    <Col sm="auto" className="border-only-right">{element.id}</Col>
                                                    <Col sm="auto">{formatar_data(element.date_movement)}</Col>
                                                </Row>
                                            </ListGroupItem>
                                        </Col>
                                    </Row>
                                </Container>
                            )
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

                        }) : ''
                }

            </ListGroup>

            <Pagination className="margin-top-bottom-10 center" aria-label="Page navigation example">
                <PaginationItem>
                    <PaginationLink className="bg_color_cinza_zimbra font_color_verde_zimbra_hover" first href="#" />
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink className="bg_color_cinza_zimbra font_color_verde_zimbra_hover" previous href="#" />
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink className="bg_color_cinza_zimbra font_color_verde_zimbra_hover" href="#">
                        1
									</PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink className="bg_color_cinza_zimbra font_color_verde_zimbra_hover" href="#">
                        2
									</PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink className="bg_color_cinza_zimbra font_color_verde_zimbra_hover" href="#">
                        3
									</PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink className="bg_color_cinza_zimbra font_color_verde_zimbra_hover" href="#">
                        4
								</PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink className="bg_color_cinza_zimbra font_color_verde_zimbra_hover" href="#">
                        5
									</PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink className="bg_color_cinza_zimbra font_color_verde_zimbra_hover" next href="#" />
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink className="bg_color_cinza_zimbra font_color_verde_zimbra_hover" last href="#" />
                </PaginationItem>
            </Pagination>
        </>
    );
}

export default Sistema;