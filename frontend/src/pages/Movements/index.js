import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    ListGroupItem,
    ListGroup,
    Pagination,
    PaginationItem,
    PaginationLink,
    NavLink,
    Input,
    ButtonGroup,
    Button
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';

import './index.css';

import api from '../../services/api';

export default function Movements() {
    const [movements, setMovements] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pagesCount, setPageCounts] = useState(0);

    const [cSelected, setCSelected] = useState([]);

    useEffect(() => {
        async function getAllMovements() {
            const response = await api.get(`/movements/${pageSize}/${currentPage}`);
            const data = await response.data;

            setPageCounts(Math.ceil(data.count / pageSize));

            setMovements(data);
        }

        getAllMovements();
    }, [currentPage, pageSize]);

    function handleCurrentPage(e, index) {
        setCurrentPage(index);
    }

    function handleSizePage(e) {
        setPageSize(parseInt(e.target.value));
        setPageCounts(Math.ceil(movements.count / parseInt(pageSize)));
    }

    function format_date(date) {
        const data_auxiliar = date.split("T");
        const data = data_auxiliar[0].split("-");
        const horario = data_auxiliar[1].split(".");

        const new_data = data[2] + "/" + data[1] + "/" + data[0];
        const new_horario = horario[0];

        return (new_data + " " + new_horario);
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

    return (
        <div className='height_content'>
            <Container className="margin_top_10 margin_bottom_30" fluid={true}>
                <Row>
                    <Col>
                        <Link
                            to="/movement/create"
                            className="font_color_verde_zimbra_hover"
                            title="Cadastrar nova movimentação"
                        ><BsPlusCircleFill size="40" />
                        </Link>
                    </Col>
                </Row>
            </Container>

            <Container className="margin_bottom_30" fluid={true}>
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
                            <Button
                                className="margin_left_right_05 border_color_verde_zimbra_hover"
                                onClick={() => onCheckboxBtnClick(8)}
                                active={cSelected.includes(8)}
                                title="Filtrar por data"
                            >Data</Button>
                        </ButtonGroup>
                    </Col>
                </Row>

                <Row>
                    <Col>
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
                    </Col>
                </Row>
            </Container>

            <Container className="center">
                <Row>
                    <Col>
                        <Container>
                            <Row>
                                <Col sm="16">
                                    <h1 className="text-center"> Últimas movimentações </h1>
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
                                        <option key={3} value={movements.count}>Tudo</option>
                                    </Input>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>

            <ListGroup>
                {
                    movements.rows !== undefined && movements.rows.length !== 0 ?
                        movements.rows.map(element => {
                            return (
                                <Container key={element.id}>
                                    <Row className="center margin_top_bottom_20">
                                        <Col xs="8">
                                            <NavLink
                                                href="#"
                                                className="font_color_black_hover no_padding"
                                            >
                                                <Row>
                                                    <Col>
                                                        <ListGroupItem>
                                                            <Row>
                                                                <Col
                                                                    sm="auto"
                                                                    className="border_only_right"
                                                                >{element.id}</Col>
                                                                <Col sm="auto">{format_date(element.date_movement)}</Col>
                                                            </Row>
                                                        </ListGroupItem>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col>
                                                        <ListGroupItem>
                                                            <Row>
                                                                <Col>
                                                                    {
                                                                        element.hardwares.map(hardware => {
                                                                            return (
                                                                                <Row key={hardware.id}>
                                                                                    <Col className="text-center">
                                                                                        <Row>
                                                                                            <Col>{hardware.category.name}</Col>    
                                                                                        </Row>
                                                                                        <Row>
                                                                                            <Col>{hardware.heritage}</Col>
                                                                                        </Row>
                                                                                    </Col>

                                                                                    <Col className="center">
                                                                                        <strong>SAIU DE:&nbsp;</strong>
                                                                                        <span>{element.previous_department.name}</span>
                                                                                    </Col>

                                                                                    <Col className="center">
                                                                                        <strong>PARA:&nbsp;</strong>
                                                                                        <span>{element.next_department.name}</span>
                                                                                    </Col>
                                                                                </Row>
                                                                            )
                                                                        })
                                                                    }
                                                                </Col>
                                                            </Row>
                                                        </ListGroupItem>
                                                    </Col>
                                                </Row>
                                            </NavLink>
                                        </Col>
                                    </Row>
                                </Container>
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

            </ListGroup>

            {movements.rows !== undefined && movements.rows.length !== 0 ?
                <Pagination
                    className="margin-top-bottom-10 center"
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

                    <PaginationItem disabled={currentPage <= 0}>
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
                                <PaginationItem active={(i * pageSize) === (currentPage)} key={i}>
                                    <PaginationLink
                                        className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
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
        </div>
    );
}