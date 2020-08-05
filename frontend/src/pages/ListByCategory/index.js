import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

// import './index.css';

import api from '../../services/api';

export default function ListByCategory() {
    const search = useParams();

    const [listCategory, setListCategory] = useState([]);

    useEffect(() => {
        async function getAll() {
            const response = await api.get(`/hardwares/category/${search.category}`);
            const data = await response.data;

            setListCategory(data);
        }

        getAll();
    }, [search.category]);

    return (
        <div className='height_content'>
            <h3 className="margin_top_20 text-center"> Lista de equipamentos cadastrados - Categoria: {search.category} ({listCategory.length}) </h3>

            <Container className="margin_top_10" fluid={true}>
                <Row className="border">
                    <Col className="border_only_right padding_all_10 center_vertical" sm="1">
                        <strong>Tombamento</strong>
                    </Col>
                    <Col className="border_only_right padding_all_10 center_vertical" sm="3">
                        <strong>Descrição</strong>
                    </Col>
                    <Col className="border_only_right padding_all_10 center_vertical" sm="1">
                        <strong>Marca</strong>
                    </Col>
                    <Col className="border_only_right padding_all_10 center_vertical" sm="1">
                        <strong>Garantia</strong>
                    </Col>
                    <Col className="border_only_right padding_all_10 center_vertical" sm="1">
                        <strong>Office</strong>
                    </Col>
                    <Col className="border_only_right padding_all_10 center_vertical" sm="1">
                        <strong>Categoria</strong>
                    </Col>
                    <Col className="border_only_right padding_all_10 center_vertical" sm="1">
                        <strong>Departamento</strong>
                    </Col>
                    <Col className="padding_all_10 center_vertical border_only_right" sm="1">
                        <strong>Chefe</strong>
                    </Col>
                    <Col className="padding_all_10 center" sm="2">
                        <strong>Ações</strong>
                    </Col>
                </Row>

                {listCategory !== undefined && listCategory.length !== 0 ?
                    listCategory.map(element => {
                        return (
                            <Row
                                key={element.id}
                                className="no_padding border"
                            >
                                <Col
                                    className="border_only_right padding_all_10 center_vertical"
                                    sm="1"
                                >{element.heritage}</Col>
                                {
                                    element.auction ?
                                        <Col
                                            className="
                                            border_only_right
                                            padding_all_10 center_vertical
                                            bg_color_vermelho_danger
                                        "
                                            sm="3"
                                        > {element.description} </Col>
                                        :
                                        element.belongs.name === "COTEC/INFRA" ?
                                            <Col
                                                className="
                                        border_only_right
                                        padding_all_10
                                        center_vertical
                                        bg_color_azul_info
                                    "
                                                sm="3"
                                            > {element.description}</Col>
                                            :
                                            <Col
                                                className="
                                        border_only_right
                                        padding_all_10
                                        center_vertical
                                        bg_color_amarelo_warning
                                    "
                                                sm="3"
                                            > {element.description}</Col>
                                }
                                <Col
                                    className="border_only_right padding_all_10 center_vertical"
                                    sm="1"
                                >{element.brand}</Col>
                                <Col
                                    className="border_only_right padding_all_10 center_vertical"
                                    sm="1"
                                >{element.warranty}</Col>
                                <Col
                                    className="border_only_right padding_all_10 center_vertical"
                                    sm="1"
                                >{element.has_office}</Col>
                                <Col
                                    className="border_only_right padding_all_10 center_vertical"
                                    sm="1"
                                >{element.category.name}</Col>
                                <Col
                                    className="border_only_right padding_all_10 center_vertical"
                                    sm="1"
                                >{element.belongs.name}</Col>
                                <Col
                                    className="padding_all_10 center_vertical border_only_right"
                                    sm="1"
                                >{element.belongs.boss}</Col>
                                <Col
                                    className="border_only_right padding_all_10 center"
                                    sm="1"
                                >
                                    <Link
                                        className="font_color_verde_zimbra_hover"
                                        to={`/hardware/edit/${element.heritage}`}
                                    >Editar</Link>
                                </Col>
                                <Col
                                    className="padding_all_10 center"
                                    sm="1"
                                >
                                    <Link
                                        className="font_color_verde_zimbra_hover"
                                        to={`/hardware/deletar/${element.heritage}`}
                                    >Deletar</Link>
                                </Col>
                            </Row>
                        );
                    }) :
                    <Row className="center">
                        <Col
                            className="padding_all_10"
                            sm="auto"
                        >
                            <h2>Não há equipamentos registrados ainda</h2>
                        </Col>
                    </Row>
                }
            </Container>
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