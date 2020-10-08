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
    ModalFooter,
    ListGroupItem,
    Input,
    Pagination,
    PaginationLink,
    PaginationItem,
} from 'reactstrap';

import api from '../../services/api';

export default function Department() {
    const search = useParams();

    const [listCategory, setListCategory] = useState([]);
    const [department, setDepartment] = useState([]);

    const [pageSize, setPageSize] = useState(10);
    const [pagesCount, setPageCounts] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const [modal, setModal] = useState(false);
    const [modalEditDepartment, setModalEditDepartment] = useState(false);
    const [hardwareToDelete, setHardwareToDelete] = useState([-1, -1]);

    const [editDepartment, setEditDepartment] = useState(false);
    const toggleModalEditDepartment = () => setModalEditDepartment(!modalEditDepartment);


    const toggle = (e) => {
        setModal(!modal)

        if (toggle) {
            setHardwareToDelete([e.target.value, e.target.name]);
        }
        else {
            setHardwareToDelete([-1, -1]);
        }
    };

    function handleSizePage(e) {
        setPageSize(parseInt(e.target.value));
        setPageCounts(Math.ceil(listCategory.count / parseInt(pageSize)));
    }

    function handleCurrentPage(e, index) {
        setCurrentPage(index);
    }

    useEffect(() => {
        async function getAll() {
            const response = await api.get(`/hardwares/department/${search.name}/${pageSize}/${currentPage}`);
            const data = await response.data;

            setPageCounts(Math.ceil((data.count) / pageSize));

            setListCategory(data);
        }

        getAll();
    }, [search.name, pageSize, currentPage]);

    useEffect(() => {
        async function getDepartment() {
            const response = await api.get(`/departments/name/${search.name}`);
            const data = await response.data;

            setDepartment(data);
        }

        getDepartment();
    }, [search.name]);

    async function deleteHardware() {
        await api.delete(`/hardwares/${hardwareToDelete[0]}`);

        window.location.reload();
    }

    return (
        <div className={
            listCategory.rows !== undefined &&
                listCategory.rows.length <= 1 ?
                "height_content" : "padding_all_10"
        }>
            <h1 className="text-center">
                Informações do departamento
            </h1>
            <Container fluid={true} className="width_70 margin_top_bottom_20">
                <ListGroupItem className="">
                    <Row className="text_left">
                        <Col sm="2">
                            <h6>DEPARTAMENTO:</h6>
                        </Col>
                        <Col sm="auto">
                            <h6>{department.name}</h6>
                        </Col>
                    </Row>
                </ListGroupItem>

                <ListGroupItem>
                    <Row className="text_left">
                        <Col sm="2">
                            <h6>RESPONSÁVEL:</h6>
                        </Col>
                        <Col sm="auto">
                            <h6>{
                                department.boss !== undefined ?
                                    department.boss.toUpperCase() :
                                    ''
                            }</h6>
                        </Col>
                    </Row>
                </ListGroupItem>

                <ListGroupItem>
                    <Row className="text_left">
                        <Col sm="auto" className="center">
                            <Button
                                className="font_color_verde_zimbra_hover"
                                onClick={toggleModalEditDepartment}
                            >
                                Editar
                            </Button>
                        </Col>
                        <Col sm="auto" className="center">
                            <Button
                                color="danger"
                            >
                                Deletar
                            </Button>
                        </Col>
                    </Row>
                </ListGroupItem>
            </Container>
            {
                listCategory.rows !== undefined &&
                    listCategory.rows.length !== 0 ?
                    <>
                        <Container className="center margin_top_100">
                            <Row>
                                <Col>
                                    <Container>
                                        <Row>
                                            <Col sm="16">
                                                <h1 className="text-center">
                                                    Lista de equipamentos cadastrados ({listCategory.count})
									</h1>
                                            </Col>
                                        </Row>

                                        <Row className="right margin_top_10">
                                            <Col>
                                                <span>Quantidade de itens mostrados</span>
                                            </Col>
                                            <Col sm="auto">
                                                <Input
                                                    type="select"
                                                    name="pageSize"
                                                    id="labelPageSize"
                                                    value={pageSize}
                                                    onChange={handleSizePage}
                                                >
                                                    <option key={0} value={5}>5</option>
                                                    <option key={1} value={10}>10</option>
                                                    <option key={2} value={20}>20</option>
                                                    <option key={3} value={listCategory.count}>Tudo</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>
                        </Container>

                        {
                            listCategory.rows !== undefined &&
                                listCategory.rows.length !== 0 ?
                                <Pagination
                                    className="margin_top_20 center"
                                    aria-label="Page navigation example"
                                >
                                    <PaginationItem disabled={currentPage <= 0}>
                                        <PaginationLink
                                            className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                                            first
                                            href="#"
                                            onClick={e => handleCurrentPage(e, 0)}
                                        />
                                    </PaginationItem>

                                    <PaginationItem disabled={currentPage <= 0} className="bg_color_cinza_zimbra">
                                        <PaginationLink
                                            className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                                            previous
                                            href="#"
                                            onClick={e => handleCurrentPage(e, currentPage - pageSize)}
                                        />
                                    </PaginationItem>

                                    {
                                        [...Array(pagesCount)].map((page, i) => {
                                            return (
                                                <PaginationItem key={i}>
                                                    <PaginationLink
                                                        className={
                                                            (i * pageSize) === (currentPage) ?
                                                                "bg_color_cinza_zimbra_active" :
                                                                "bg_color_cinza_zimbra"
                                                        }
                                                        href="#"
                                                        onClick={e => handleCurrentPage(e, (i * pageSize))}
                                                    > {i + 1} </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })
                                    }

                                    <PaginationItem disabled={currentPage >= (pagesCount - 1) * pageSize}>
                                        <PaginationLink
                                            className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                                            next
                                            href="#"
                                            onClick={e => handleCurrentPage(e, (currentPage + pageSize))}
                                        />
                                    </PaginationItem>

                                    <PaginationItem disabled={currentPage >= (pagesCount - 1) * pageSize}>
                                        <PaginationLink
                                            className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                                            last
                                            href="#"
                                            onClick={e => handleCurrentPage(e, (pagesCount - 1) * pageSize)}
                                        />
                                    </PaginationItem>
                                </Pagination>
                                : ''
                        }

                        <Container className="margin_top_20 width_70" fluid={true}>
                            <ListGroupItem>
                                <Row>
                                    <Col
                                        className="
                                            border_only_right
                                            padding_all_10 center
                                            border_color_gray
                                        "
                                        sm="2"
                                    >
                                        <strong>Tombamento</strong>
                                    </Col>
                                    <Col
                                        className="
                                            border_only_right
                                            padding_all_10
                                            center
                                            border_color_gray
                                        "
                                        sm="4"
                                    >
                                        <strong>Descrição</strong>
                                    </Col>
                                    <Col
                                        className="
                                            border_only_right
                                            padding_all_10
                                            center
                                            border_color_gray
                                        "
                                        sm="2">
                                        <strong>Categoria</strong>
                                    </Col>
                                    <Col
                                        className="
                                            padding_all_10
                                            center
                                        "
                                        sm="4"
                                    >
                                        <strong>Ações</strong>
                                    </Col>
                                </Row>
                            </ListGroupItem>

                            {
                                listCategory.rows !== undefined &&
                                    listCategory.rows.length !== 0 ?
                                    listCategory.rows.map(element => {
                                        return (
                                            <ListGroupItem className="margin_top_bottom_10">
                                                <Row
                                                    key={element.id}
                                                    className="no_padding"
                                                >
                                                    <Col
                                                        className="
                                                            border_only_right
                                                            padding_all_10
                                                            center_vertical
                                                            border_color_gray
                                                        "
                                                        sm="2"
                                                    >{element.heritage}</Col>
                                                    <Col
                                                        className="
                                                            border_only_right
                                                            padding_all_10 center_vertical
                                                            border_color_gray
                                                        "
                                                        sm="4"
                                                    >{element.description}</Col>
                                                    <Col
                                                        className="
                                                            border_only_right
                                                            padding_all_10
                                                            center_vertical
                                                            border_color_gray
                                                        "
                                                        sm="2"
                                                    >{element.category.name}</Col>
                                                    <Col
                                                        className="
                                                            border_only_right
                                                            padding_all_10
                                                            center
                                                            border_color_gray
                                                        "
                                                        sm="2"
                                                    >
                                                        <Link
                                                            className="font_color_verde_zimbra_hover"
                                                            to={`/hardware/edit/${element.id}`}
                                                        >Editar</Link>
                                                    </Col>
                                                    <Col
                                                        className="padding_all_10 center"
                                                        sm="2"
                                                    >
                                                        <Button
                                                            onClick={toggle}
                                                            color="danger"
                                                            value={element.id}
                                                            name={element.heritage}
                                                        >Deletar</Button>
                                                    </Col>
                                                </Row>
                                            </ListGroupItem>
                                        );
                                    }) : ''
                            }
                        </Container>

                        {
                            listCategory.rows !== undefined &&
                                listCategory.rows.length !== 0 ?
                                <Pagination
                                    className="margin_top_20 center"
                                    aria-label="Page navigation example"
                                >
                                    <PaginationItem disabled={currentPage <= 0}>
                                        <PaginationLink
                                            className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                                            first
                                            href="#"
                                            onClick={e => handleCurrentPage(e, 0)}
                                        />
                                    </PaginationItem>

                                    <PaginationItem disabled={currentPage <= 0} className="bg_color_cinza_zimbra">
                                        <PaginationLink
                                            className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                                            previous
                                            href="#"
                                            onClick={e => handleCurrentPage(e, currentPage - pageSize)}
                                        />
                                    </PaginationItem>

                                    {
                                        [...Array(pagesCount)].map((page, i) => {
                                            return (
                                                <PaginationItem key={i}>
                                                    <PaginationLink
                                                        className={
                                                            (i * pageSize) === (currentPage) ?
                                                                "bg_color_cinza_zimbra_active" :
                                                                "bg_color_cinza_zimbra"
                                                        }
                                                        href="#"
                                                        onClick={e => handleCurrentPage(e, (i * pageSize))}
                                                    > {i + 1} </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })
                                    }

                                    <PaginationItem disabled={currentPage >= (pagesCount - 1) * pageSize}>
                                        <PaginationLink
                                            className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                                            next
                                            href="#"
                                            onClick={e => handleCurrentPage(e, (currentPage + pageSize))}
                                        />
                                    </PaginationItem>

                                    <PaginationItem disabled={currentPage >= (pagesCount - 1) * pageSize}>
                                        <PaginationLink
                                            className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                                            last
                                            href="#"
                                            onClick={e => handleCurrentPage(e, (pagesCount - 1) * pageSize)}
                                        />
                                    </PaginationItem>
                                </Pagination>
                                : ''
                        }

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
                    </>
                    :
                    <Row className="center no_margin">
                        <Col
                            className="padding_all_10"
                            sm="auto"
                        >
                            <h2>Não há equipamentos registrados ainda</h2>
                        </Col>
                    </Row>
            }
            <Modal isOpen={modalEditDepartment} toggle={toggleModalEditDepartment}>
                <ModalHeader toggle={toggleModalEditDepartment}>
                    Editar informações do departamento: {department.name}
                </ModalHeader>

                <ModalBody>
                    <Input
                        value={department.name}
                    />

                    <Input
                        value={department.boss}
                    />
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={toggleModalEditDepartment}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={toggleModalEditDepartment}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}