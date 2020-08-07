import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroupItem, ListGroup, Pagination, PaginationItem, PaginationLink, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';

import './index.css';

import api from '../../services/api';

export default function Movements() {
    const [movements, setMovements] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pagesCount, setPageCounts] = useState(0);

    useEffect(() => {
        async function getAllMovements() {
            const response = await api.get(`/movements/${currentPage}`);
            const data = await response.data;

            setPageCounts(Math.ceil(data.count / pageSize));
            setMovements(data);
        }

        getAllMovements();
    }, [currentPage, pageSize]);

    function handleCurrentPage(e, index) {
        setCurrentPage(index);
    }

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

            <h1 className="text-center"> Últimas movimentações </h1>
            <ListGroup>
                <Container>
                    {
                        movements.rows !== undefined && movements.rows.length !== 0 ?
                            movements.rows.map(element => {
                                return (
                                    <Row
                                        className="center margin_top_bottom_20"
                                        key={element.id}
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
                                                        >{element.id}</Col>
                                                        <Col sm="auto">{format_date(element.date_movement)}</Col>
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
                        onClick={e => handleCurrentPage(e, currentPage - 10)}
                    />
                </PaginationItem>

                {movements.rows !== undefined && movements.rows.length !== 0 ?
                    [...Array(pagesCount)].map((page, i) => {
                        return (
                        <PaginationItem active={(i * 10) === (currentPage)} key={i}>
                            <PaginationLink
                                className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                                href="#"
                                onClick={e => handleCurrentPage(e, (i * 10))}
                            > {i + 1} </PaginationLink>
                        </PaginationItem>
                        );
                    })
                    : ''
                }

                <PaginationItem disabled={currentPage >= (pagesCount - 1) * 10}>
                    <PaginationLink
                        className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                        next
                        href="#"
                        onClick={e => handleCurrentPage(e, (currentPage + 10))}
                    />
                </PaginationItem>

                <PaginationItem disabled={currentPage >= (pagesCount - 1) * 10}>
                    <PaginationLink
                        className="bg_color_cinza_zimbra font_color_verde_zimbra_hover"
                        last
                        href="#"
                        onClick={e => handleCurrentPage(e, (pagesCount - 1) * 10)}
                    />
                </PaginationItem>
            </Pagination>
        </div>
    );
}