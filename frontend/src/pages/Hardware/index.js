import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Input, Container, Row, Col, ButtonGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';

import './index.css';

import api from '../../services/api';

export default function Hardware() {
    const [hardware, setHardwares] = useState([]);

    const [cSelected, setCSelected] = useState([]);

    const [modal, setModal] = useState(false);
    const [hardwareToDelete, setHardwareToDelete] = useState([-1, -1]);


    const toggle = (e) => {
        setModal(!modal)

        if (toggle) {
            setHardwareToDelete([e.target.value, e.target.name]);
        }
        else {
            setHardwareToDelete([-1, -1]);
        }
    };

    useEffect(() => {
        async function getAllHardwares() {
            const response = await api.get('/hardwares/detailed');
            const data = await response.data;

            setHardwares(data);
        }

        getAllHardwares();
    }, []);

    const onCheckboxBtnClick = (selected) => {
        const index = cSelected.indexOf(selected);
        if (index < 0) {
            cSelected.push(selected);
        } else {
            cSelected.splice(index, 1);
        }
        setCSelected([...cSelected]);
    }

    async function deleteHardware() {
        await api.delete(`/hardwares/${hardwareToDelete[0]}`);

        window.location.reload();
    }

    return (
        <div className="height_content">
            <Container className="margin_top_10 margin_bottom_30" fluid={true}>
                <Row>
                    <Col>
                        <Link
                            to="/hardware/create"
                            className="font_color_verde_zimbra_hover"
                            title="Cadastrar novo equipamento"
                        ><BsPlusCircleFill size="40" />
                        </Link>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row>
                    <Col className="center">
                        <ButtonGroup className="margin_bottom_20">
                            <Button
                                className="margin_left_right_05 border_color_verde_zimbra_hover"
                                onClick={() => onCheckboxBtnClick(1)}
                                active={cSelected.includes(1)}
                                title="Filtrar por tombamento"
                            >Tombamento</Button>
                            <Button
                                className="margin_left_right_05 border_color_verde_zimbra_hover"
                                onClick={() => onCheckboxBtnClick(2)}
                                active={cSelected.includes(2)}
                                title="Filtrar por marca"
                            >Marca</Button>
                            <Button
                                className="margin_left_right_05 border_color_verde_zimbra_hover"
                                onClick={() => onCheckboxBtnClick(3)}
                                active={cSelected.includes(3)}
                                title="Filtrar por garantia"
                            >Garantia</Button>
                            <Button
                                className="margin_left_right_05 border_color_verde_zimbra_hover"
                                onClick={() => onCheckboxBtnClick(4)}
                                active={cSelected.includes(4)}
                                title="Filtrar por ferramenta office"
                            >Office</Button>
                            <Button
                                className="margin_left_right_05 border_color_verde_zimbra_hover"
                                onClick={() => onCheckboxBtnClick(5)}
                                active={cSelected.includes(5)}
                                title="Filtrar por máquinas leiloadas"
                            >Leilão</Button>
                            <Button
                                className="margin_left_right_05 border_color_verde_zimbra_hover"
                                onClick={() => onCheckboxBtnClick(6)}
                                active={cSelected.includes(6)}
                                title="Filtrar por categoria"
                            >Categoria</Button>
                            <Button
                                className="margin_left_right_05 border_color_verde_zimbra_hover"
                                onClick={() => onCheckboxBtnClick(7)}
                                active={cSelected.includes(7)}
                                title="Filtrar por departamento"
                            >Departamento</Button>
                        </ButtonGroup>
                    </Col>
                </Row>

                <Row>
                    <Col>
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
                    </Col>
                </Row>
            </Container>

            <h3 className="margin_top_20 text-center"> Lista de equipamentos cadastrados </h3>

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

                {hardware !== undefined && hardware.length !== 0 ?
                    hardware.map(element => {
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
                                    <Button
                                        onClick={toggle}
                                        color="danger"
                                        value={element.id}
                                        name={element.heritage}
                                    >Deletar</Button>
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
            
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Tem certeza?</ModalHeader>
                <ModalBody>
                    Tem certeza que desejar deletar o equipamento de tombo {hardwareToDelete[1]}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={deleteHardware}>Sim</Button>
                    <Button color="secondary" onClick={toggle}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}