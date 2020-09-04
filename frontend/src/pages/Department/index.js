import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';

import api from '../../services/api';

export default function Department() {
    const search = useParams();

    const [listCategory, setListCategory] = useState([]);

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
        async function getAll() {
            const response = await api.get(`/hardwares/department/${search.name}/category`);
            const data = await response.data;

            setListCategory(data);
        }

        getAll();
    }, [search.name]);

    async function deleteHardware() {
        await api.delete(`/hardwares/${hardwareToDelete[0]}`);

        window.location.reload();
    }

    return (
        <div className={listCategory.rows !== undefined && listCategory.rows.length <= 8 ? "height_content" : ""}>
            <h3 className="margin_top_20 text-center"> Lista de equipamentos cadastrados - Departamento: {search.name} ({listCategory.count}) </h3>

            <Container className="margin_top_20" fluid={true}>
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

                {listCategory.rows !== undefined && listCategory.rows.length !== 0 ?
                    listCategory.rows.map(element => {
                        return (
                            <Row
                                key={element.id}
                                className="no_padding border"
                            >
                                <Col
                                    className="border_only_right padding_all_10 center_vertical"
                                    sm="1"
                                >{element.heritage}</Col>
                                <Col
                                    className="
                                        border_only_right
                                        padding_all_10 center_vertical
                                    "
                                    sm="3"
                                > {element.description} </Col>
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
                                        to={`/hardware/edit/${element.id}`}
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
                <ModalHeader toggle={toggle}>Deletar equipamento</ModalHeader>
                <ModalBody>
                    Tem certeza que desejar&nbsp;
					<strong className="font_color_danger">DELETAR</strong>
					&nbsp;o equipamento de tombo&nbsp;
					<strong className="font_color_danger">{hardwareToDelete[1]}</strong>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={deleteHardware}>Sim</Button>
                    <Button className="bg_color_verde_zimbra" onClick={toggle}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}