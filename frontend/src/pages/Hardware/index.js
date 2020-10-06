import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import {
    Input,
    Container,
    Row,
    Col,
    ButtonGroup,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Tooltip,
    PaginationLink,
    PaginationItem,
    Pagination,
    ListGroupItem
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';

import api from '../../services/api';

export default function Hardware() {
    const [hardware, setHardwares] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pagesCount, setPageCounts] = useState(0);

    const [querySearch, setQuerySearch] = useState('');

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

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggleNotification = () => setTooltipOpen(!tooltipOpen);

    useEffect(() => {
        async function getAllHardwares() {
            const response = await api.get(`/hardwares/${pageSize}/${currentPage}/filters?${querySearch}`);
            const data = await response.data;

            setPageCounts(Math.ceil((data.count) / pageSize));

            setHardwares(data);
        }

        getAllHardwares();
    }, [pageSize, currentPage, querySearch]);

    function handleCurrentPage(e, index) {
        setCurrentPage(index);
    }

    function handleSizePage(e) {
        setPageSize(parseInt(e.target.value));
        setPageCounts(Math.ceil(hardware.count / parseInt(pageSize)));
    }

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

    function handleValueInput(e) {
        const body = e.target.value.split(";").map(element => {
            return (element)
        });

        const parameters = cSelected.map(element => {
            return (element);
        });

        let string = '';

        parameters.map((element, index) => {
            if (index > 0) {
                return (string += "&" + element + "=" + body[index]);
            }
            else {
                return (string += element + "=" + body[index]);
            }
        });

        setQuerySearch(string);
    }

    return (
        <div className={
            hardware.rows !== undefined &&
                hardware.rows.length <= 1 ?
                "height_content" : "padding_all_10"
        }>
            <Container className="margin_bottom_30" fluid={true}>
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
                                className="
									margin_left_right_05
									border_color_verde_zimbra_hover
									bg_color_verde_zimbra
								"
                                onClick={() => onCheckboxBtnClick('heritage')}
                                active={cSelected.includes('heritage')}
                                title="Filtrar por tombamento"
                            >Tombamento</Button>
                            <Button
                                className="
									margin_left_right_05
									border_color_verde_zimbra_hover
									bg_color_verde_zimbra
								"
                                onClick={() => onCheckboxBtnClick('brand')}
                                active={cSelected.includes('brand')}
                                title="Filtrar por marca"
                            >Marca</Button>
                            <Button
                                className="
									margin_left_right_05
									border_color_verde_zimbra_hover
									bg_color_verde_zimbra
								"
                                onClick={() => onCheckboxBtnClick('warranty')}
                                active={cSelected.includes('warranty')}
                                title="Filtrar por garantia"
                            >Garantia</Button>
                            <Button
                                className="
									margin_left_right_05
									border_color_verde_zimbra_hover
									bg_color_verde_zimbra
								"
                                onClick={() => onCheckboxBtnClick('has_office')}
                                active={cSelected.includes('has_office')}
                                title="Filtrar por ferramenta office"
                            >Office</Button>
                            <Button
                                className="
									margin_left_right_05
									border_color_verde_zimbra_hover
									bg_color_verde_zimbra
								"
                                onClick={() => onCheckboxBtnClick('auction')}
                                active={cSelected.includes('auction')}
                                title="Filtrar por máquinas leiloadas"
                            >Leilão</Button>
                            <Button
                                className="
									margin_left_right_05
									border_color_verde_zimbra_hover
									bg_color_verde_zimbra
								"
                                onClick={() => onCheckboxBtnClick('category')}
                                active={cSelected.includes('category')}
                                title="Filtrar por categoria"
                            >Categoria</Button>
                            <Button
                                className="
									margin_left_right_05
									border_color_verde_zimbra_hover
									bg_color_verde_zimbra
								"
                                onClick={() => onCheckboxBtnClick('department')}
                                active={cSelected.includes('department')}
                                title="Filtrar por departamento"
                            >Departamento</Button>
                        </ButtonGroup>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Container>
                            <Row>
                                <Col className="center">
                                    <Input
                                        type="text"
                                        name="filter"
                                        placeholder="Procurar"
                                        className="background_color_white_zimbra"
                                        onChange={handleValueInput}
                                    />
                                </Col>
                                <Col sm="1" className="center">
                                    <span id="TooltipExample">!</span>
                                    <Tooltip
                                        placement="right"
                                        isOpen={tooltipOpen}
                                        target="TooltipExample"
                                        toggle={toggleNotification}
                                    >
                                        Separe os campos por ';' (ponto e vírgula) e sem espaços.
									</Tooltip>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>

            <Container className="center margin_top_30">
                <Row>
                    <Col>
                        <Container>
                            <Row>
                                <Col sm="16">
                                    <h1 className="text-center">
                                        Lista de equipamentos cadastrados ({hardware.count})
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
                                        <option key={3} value={hardware.count}>Tudo</option>
                                    </Input>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>

            {
                hardware.rows !== undefined &&
                    hardware.rows.length !== 0 ?
                    <Pagination
                        className="margin_top_20 center"
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
                        <Col className="border_only_right padding_all_10 center border_color_gray" sm="2">
                            <strong>Tombamento</strong>
                        </Col>
                        <Col className="border_only_right padding_all_10 center border_color_gray" sm="4">
                            <strong>Descrição</strong>
                        </Col>
                        <Col className="border_only_right padding_all_10 center border_color_gray" sm="2">
                            <strong>Categoria</strong>
                        </Col>
                        <Col className="padding_all_10 center" sm="4">
                            <strong>Ações</strong>
                        </Col>
                    </Row>
                </ListGroupItem>
            </Container>

            <Container className="width_70" fluid={true}>
                {
                    hardware.rows !== undefined &&
                        hardware.rows.length !== 0 ?
                        hardware.rows.map(element => {
                            return (
                                <ListGroupItem key={element.id}>
                                    <Row
                                        className="no_padding"
                                    >
                                        <Col
                                            className="padding_all_10 center_vertical"
                                            sm="2"
                                        >{element.heritage}</Col>
                                        {
                                            element.auction ?
                                                <Col
                                                    className="
														border
														padding_all_10 center_vertical
                                                        border_color_vermelho_danger
													"
                                                    sm="4"
                                                > {element.description} </Col>
                                                :
                                                element.belongs.name === "COTEC/INFRA" ?
                                                    <Col
                                                        className="
                                                            border
                                                            border_color_azul_info
                                                            padding_all_10
                                                            center_vertical
                                                        "
                                                        sm="4"
                                                    > {element.description}</Col>
                                                    :
                                                    <Col
                                                        className="
                                                            border
                                                            padding_all_10
                                                            center_vertical
                                                            border_color_amarelo_warning
                                                        "
                                                        sm="4"
                                                    > {element.description}</Col>
                                        }
                                        <Col
                                            className="border_only_right padding_all_10 center_vertical border_color_gray"
                                            sm="2"
                                        >{
                                            element.category !== null && element.category.name
                                        }</Col>
                                        <Col
                                            className="border_only_right padding_all_10 center border_color_gray"
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

            {
                hardware.rows !== undefined &&
                    hardware.rows.length !== 0 ?
                    <Pagination
                        className="margin_top_20 center"
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
        </div>
    );
}