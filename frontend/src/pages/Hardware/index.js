import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Input, Container, Row, Col } from 'reactstrap';

import './index.css';

import api from '../../services/api';

import { Link } from 'react-router-dom';

export default function Hardware() {
    const [hardware, setHardwares] = useState([]);

    useEffect(() => {
        async function getAllHardwares() {
            const response = await api.get('/hardwares/detailed');
            const data = await response.data;

            setHardwares(data);
        }

        getAllHardwares();
    }, []);

    return (
        <div className="height_content margin_top_bottom_10">
            <Form>
                <FormGroup>
                    <Container>
                        <Row>
                            <Col>
                                <Input
                                    type="text"
                                    name="equipment"
                                    id="equipement"
                                    placeholder="Procurar"
                                    className="width_100"
                                />
                            </Col>
                        </Row>
                    </Container>
                </FormGroup>
            </Form>

            <h3 className="text-center"> Lista de Equipamentos </h3>
            <Container className="padding_all_30" fluid={true}>
                <Row className="border">
                    <Col className="border_only_right padding_all_10 center_vertical" sm="1">
                        <strong>Tombamento</strong>
                    </Col>
                    <Col className="border_only_right padding_all_10 center_vertical" sm="4">
                        <strong>Descrição</strong>
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
                <Row className="border">
                    <Col>
                        {hardware !== undefined && hardware.length !== 0 ?
                            hardware.map(element => {
                                return (
                                    <Row
                                        key={element.id}
                                        className="no_padding"
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
                                                    sm="4"
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
                                                        sm="4"
                                                    > {element.description}</Col>
                                                    :
                                                    <Col
                                                        className="
													border_only_right
													padding_all_10
													center_vertical
													bg_color_amarelo_warning
												"
                                                        sm="4"
                                                    > {element.description}</Col>
                                        }
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
                    </Col>
                </Row>
            </Container>
        </div>
    );
}