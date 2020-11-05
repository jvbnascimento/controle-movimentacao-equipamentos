import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect, useContext } from 'react';
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
    ListGroupItem,
    Alert
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';
import { AiFillQuestionCircle } from 'react-icons/ai';

import api from '../../services/api';

import AuthContext from '../../contexts/auth';

export default function Hardware() {
    const [hardware, setHardwares] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pagesCount, setPageCounts] = useState(0);
    const [querySearch, setQuerySearch] = useState('');
    const [cSelected, setCSelected] = useState([]);
    const [modal, setModal] = useState(false);
    const [hardwareToDelete, setHardwareToDelete] = useState([-1, -1]);
    const [visible, setVisible] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const { message, setMessage, colorMessage } = useContext(AuthContext);

    useEffect(() => {
        async function getAllHardwares() {
            const response = await api.get(`/hardwares/${pageSize}/${currentPage}/filters?${querySearch}`);
            const data = await response.data;

            setPageCounts(Math.ceil((data.count) / pageSize));

            setHardwares(data);
        }

        getAllHardwares();
    }, [pageSize, currentPage, querySearch, message]);

    useEffect(() => {
        function verifyMessage() {
            if (message[0] !== '') {
                setVisible(true);
            }
        }

        verifyMessage();
    }, [message]);

    const onDismiss = () => {
        setVisible(false);
        setMessage(['', -1]);
    }

    const toggle = (e) => {
        setModal(!modal)

        if (toggle) {
            setHardwareToDelete([e.target.value, e.target.name]);
        }
        else {
            setHardwareToDelete([-1, -1]);
        }
    };

    const toggleNotification = () => setTooltipOpen(!tooltipOpen);

    const handleCurrentPage = (e, index) => {
        e.preventDefault();
        setCurrentPage(index);
    }

    const handleSizePage = (e) => {
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

    const deleteHardware = async () => {
        await api.delete(`/hardwares/${hardwareToDelete[0]}`);

        setMessage([`Equipamento de tombo ${hardwareToDelete[1]} foi deletado com sucesso`, 200]);
        setHardwareToDelete([-1, -1]);
        setModal(!modal);
    }

    const handleValueInput = (e) => {
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
        <div className={hardware.rows !== undefined && hardware.rows.length !== 0 ? "" : "height_content"}>
            <Container className="width_30">
                <Alert color={
                    colorMessage[message[1]]
                }
                    isOpen={visible}
                    toggle={onDismiss}
                >
                    {message[0]}
                </Alert>
            </Container>

            <Container className="margin_bottom_30 padding_all_10" fluid={true}>
                <Row sm="auto" className="no_margin">
                    <Col sm="auto">
                        <Link
                            to="/hardware/create"
                            className="font_color_verde_zimbra_hover"
                            title="Cadastrar novo equipamento"
                        >
                            <BsPlusCircleFill size="40" />
                        </Link>
                    </Col>
                </Row>
            </Container>

            {hardware.rows !== undefined && hardware.rows.length !== 0 ?
                <Container className="margin_bottom_30">
                    <Row>
                        <Col className="center">
                            <ButtonGroup className="margin_bottom_20">
                                <Button
                                    onClick={() => onCheckboxBtnClick('heritage')}
                                    active={cSelected.includes('heritage')}
                                    title="Filtrar por tombamento"
                                    className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra"
                                >
                                    Tombamento
                            </Button>

                                <Button
                                    onClick={() => onCheckboxBtnClick('brand')}
                                    active={cSelected.includes('brand')}
                                    title="Filtrar por marca"
                                    className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra"
                                >
                                    Marca
                            </Button>

                                <Button
                                    onClick={() => onCheckboxBtnClick('warranty')}
                                    active={cSelected.includes('warranty')}
                                    title="Filtrar por garantia"
                                    className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra"
                                >
                                    Garantia
                            </Button>

                                <Button
                                    onClick={() => onCheckboxBtnClick('has_office')}
                                    active={cSelected.includes('has_office')}
                                    title="Filtrar por ferramenta office"
                                    className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra"
                                >
                                    Office
                            </Button>

                                <Button
                                    onClick={() => onCheckboxBtnClick('auction')}
                                    active={cSelected.includes('auction')}
                                    title="Filtrar por máquinas leiloadas"
                                    className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra"
                                >
                                    Leilão
                            </Button>

                                <Button
                                    onClick={() => onCheckboxBtnClick('category')}
                                    active={cSelected.includes('category')}
                                    title="Filtrar por categoria"
                                    className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra"
                                >
                                    Categoria
                            </Button>

                                <Button
                                    onClick={() => onCheckboxBtnClick('belongs')}
                                    active={cSelected.includes('belongs')}
                                    title="Filtrar por departamento"
                                    className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra"
                                >
                                    Departamento
                            </Button>
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
                                        <span id="TooltipExample">
                                            <AiFillQuestionCircle size="30" />
                                        </span>
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
                : ''
            }

            {hardware.rows !== undefined && hardware.rows.length !== 0 ?
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
                : ''
            }

            {hardware.rows !== undefined && hardware.rows.length !== 0 ?
                <Pagination className="margin_top_20 center">
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

            {hardware.rows !== undefined && hardware.rows.length !== 0 ?
                <Container fluid={true} className="margin_top_20 width_70">
                    <ListGroupItem>
                        <Row>
                            <Col sm="2" className="border_only_right padding_all_10 center border_color_gray">
                                <strong>Tombamento</strong>
                            </Col>
                            <Col sm="4" className="border_only_right padding_all_10 center border_color_gray">
                                <strong>Descrição</strong>
                            </Col>
                            <Col sm="2" className="border_only_right padding_all_10 center border_color_gray">
                                <strong>Categoria</strong>
                            </Col>
                            <Col sm="4" className="padding_all_10 center">
                                <strong>Ações</strong>
                            </Col>
                        </Row>
                    </ListGroupItem>
                </Container>
                : ''
            }

            <Container className="width_70 padding_all_10" fluid={true}>
                {hardware.rows !== undefined && hardware.rows.length !== 0 ?
                    hardware.rows.map(element => {
                        return (
                            <ListGroupItem key={element.id}>
                                <Row className="center margin_top_bottom_20">
                                    <Col sm="2" className="padding_all_10 center_vertical">
                                        {element.heritage}
                                    </Col>
                                    {element.auction ?
                                        <Col sm="4" className="border padding_all_10 center_vertical border_color_vermelho_danger">
                                            {element.description}
                                        </Col>
                                        :
                                        element.belongs.name === "COTEC/INFRA" ?
                                            <Col sm="4" className="border border_color_azul_info padding_all_10 center_vertical">
                                                {element.description}
                                            </Col>
                                            :
                                            <Col sm="4" className="border padding_all_10 center_vertical border_color_amarelo_warning">
                                                {element.description}
                                            </Col>
                                    }
                                    <Col sm="2" className="border_only_right padding_all_10 center_vertical border_color_gray">
                                        {element.category !== null && element.category.name}
                                    </Col>
                                    <Col sm="2" className="border_only_right padding_all_10 center border_color_gray">
                                        <Link to={`/hardware/edit/${element.id}`} className="font_color_verde_zimbra_hover">
                                            Editar
                                        </Link>
                                    </Col>
                                    <Col sm="2" className="padding_all_10 center">
                                        <Button
                                            onClick={toggle}
                                            color="danger"
                                            value={element.id}
                                            name={element.heritage}
                                        >
                                            Deletar
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                        );
                    }) :
                    <Row className="margin_top_bottom_20 center">
                        <Col sm="auto" className="text-center">
                            <h3>Não há equipamentos registrados ainda</h3>
                        </Col>
                    </Row>
                }
            </Container>

            {hardware.rows !== undefined && hardware.rows.length !== 0 ?
                    <Pagination className="margin_top_20 center">
                        <PaginationItem disabled={currentPage <= 0}>
                            <PaginationLink
                                first
                                href="#"
                                onClick={e => handleCurrentPage(e, 0)}
                                className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                            />
                        </PaginationItem>

                        <PaginationItem disabled={currentPage <= 0} className="bg_color_cinza_zimbra">
                            <PaginationLink
                                previous
                                href="#"
                                onClick={e => handleCurrentPage(e, currentPage - pageSize)}
                                className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                            />
                        </PaginationItem>

                        {[...Array(pagesCount)].map((page, i) => {
                                return (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            onClick={e => handleCurrentPage(e, (i * pageSize))}
                                            className={(i * pageSize) === (currentPage) ? "bg_color_cinza_zimbra_active" : "bg_color_cinza_zimbra"}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })
                        }

                        <PaginationItem disabled={currentPage >= (pagesCount - 1) * pageSize}>
                            <PaginationLink
                                next
                                href="#"
                                onClick={e => handleCurrentPage(e, (currentPage + pageSize))}
                                className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                            />
                        </PaginationItem>

                        <PaginationItem disabled={currentPage >= (pagesCount - 1) * pageSize}>
                            <PaginationLink
                                last
                                href="#"
                                onClick={e => handleCurrentPage(e, (pagesCount - 1) * pageSize)}
                                className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
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
                    <Button onClick={toggle} className="bg_color_verde_zimbra">Cancelar</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}