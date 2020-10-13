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
    Input,
    ButtonGroup,
    Button,
    DropdownItem,
    Tooltip
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';

import api from '../../services/api';

export default function Movements() {
    const [movements, setMovements] = useState([]);
    
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pagesCount, setPageCounts] = useState(0);

    const [querySearch, setQuerySearch] = useState('');

    const [cSelected, setCSelected] = useState([]);

    useEffect(() => {
        async function filteredSearch() {
            const response = await api.get(`/movements/${pageSize}/${currentPage}/filters?${querySearch}`);
            const data = await response.data;

            setPageCounts(Math.ceil((data.count) / pageSize));
            setMovements(data);
        }

        filteredSearch();
    }, [querySearch, currentPage, pageSize]);

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

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);


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
			movements.rows !== undefined &&
			movements.rows.length <= 1 ?
			"height_content" : "padding_all_10"
		}>
            <Container className="margin_bottom_30" fluid={true}>
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
                                onClick={() => onCheckboxBtnClick('belongs')}
                                active={cSelected.includes('belongs')}
                                title="Filtrar por departamento"
                            >Departamento</Button>
                            {/* <Button
                                className="
									margin_left_right_05
									border_color_verde_zimbra_hover
									bg_color_verde_zimbra
								"
                                onClick={() => onCheckboxBtnClick('date_movement')}
                                active={cSelected.includes('date_movement')}
                                title="Filtrar por data"
                            >Data</Button> */}
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
										toggle={toggle}
									>
                                        Separe os campos por ';' (ponto e vírgula) e sem espaços.
									</Tooltip>
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
                                    <h1 className="text-center">
										Últimas movimentações ({movements.count})
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
                                        <option key={3} value={movements.count}>Tudo</option>
                                    </Input>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>

            {
				movements.rows !== undefined &&
				movements.rows.length !== 0 ?
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

            <ListGroup>
                {
					movements.rows !== undefined &&
					movements.rows.length !== 0 ?
                        movements.rows.map(element => {
                            return (
                                <Container key={element.id}>
                                    <Row className="center margin_top_bottom_20">
                                        <Col>
                                            <Link
                                                to={
                                                    `/movement/edit/${element.id}`
                                                }
                                                className="font_color_black_hover no_padding"
                                            >
                                                <ListGroupItem>
                                                    <Row>
                                                        <Col
                                                            sm="auto"
                                                            className="center border_only_right border_color_gray"
                                                        >{element.id}</Col>
                                                        <Col>
                                                            <Row className="margin_bottom_20">
                                                                <Col>
                                                                    <Row>
                                                                        <Col className="center border_only_right border_color_gray">
                                                                            <Row>
                                                                                <Col
                                                                                    sm="auto"
                                                                                >{format_date(element.date_movement)}</Col>
                                                                            </Row>
                                                                        </Col>

                                                                        <Col className="center">
                                                                            <Row>
                                                                                <Col sm="auto">
                                                                                    <strong>{element.responsible.name}</strong>
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>

                                                            <DropdownItem divider />

                                                            <Row className="margin_top_20">
                                                                <Col>

                                                                    <Row>
                                                                        <Col>
                                                                            {
                                                                                element.hardwares.map((hardware, index) => {
                                                                                    if (element.hardwares.length > 1 && index < element.hardwares.length - 1) {
                                                                                        return (
                                                                                            <div key={hardware.id}>
                                                                                                <Row className="margin_top_10">
                                                                                                    <Col className="text-center border_only_right border_color_gray">
                                                                                                        <Row>
                                                                                                            <Col>{hardware.category.name}</Col>
                                                                                                        </Row>
                                                                                                        <Row>
                                                                                                            <Col>{hardware.heritage}</Col>
                                                                                                        </Row>
                                                                                                    </Col>

                                                                                                    <Col className="center border_only_right border_color_gray">
                                                                                                        <strong>SAIU DE:&nbsp;</strong>
                                                                                                        <span>{element.previous_department.name}</span>
                                                                                                    </Col>

                                                                                                    <Col className="center">
                                                                                                        <strong>PARA:&nbsp;</strong>
                                                                                                        <span>{element.next_department.name}</span>
                                                                                                    </Col>
                                                                                                </Row>

                                                                                                <DropdownItem divider />
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                    return (
                                                                                        <Row key={hardware.id} className="margin_top_10">
                                                                                            <Col className="text-center border_only_right border_color_gray">
                                                                                                <Row>
                                                                                                    <Col>{hardware.category.name}</Col>
                                                                                                </Row>
                                                                                                <Row>
                                                                                                    <Col>{hardware.heritage}</Col>
                                                                                                </Row>
                                                                                            </Col>

                                                                                            <Col className="center border_only_right border_color_gray">
                                                                                                <strong>SAIU DE:&nbsp;</strong>
                                                                                                <span>{element.previous_department.name}</span>
                                                                                            </Col>

                                                                                            <Col className="center">
                                                                                                <strong>PARA:&nbsp;</strong>
                                                                                                <span>{element.next_department.name}</span>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </Col>
                                                                    </Row>

                                                                </Col>
                                                            </Row>

                                                        </Col>
                                                    </Row>
                                                </ListGroupItem>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Container>
                            )
                        }) :
						movements.rows !== undefined &&
						movements.rows.length !== 0 ?
                            movements.rows.map(element => {
                                return (
                                    <Container key={element.id}>
                                        <Row className="center margin_top_bottom_20">
                                            <Col>
                                                <Link
                                                    to={
                                                        `/movement/edit/${element.id}`
                                                    }
                                                    className="font_color_black_hover no_padding"
                                                >
                                                    <ListGroupItem>
                                                        <Row>
                                                            <Col
                                                                sm="auto"
                                                                className="
                                                                    center
                                                                    border_only_right
                                                                    border_color_gray
                                                                "
                                                            >
                                                                {element.id}
                                                            </Col>
                                                            <Col>
                                                                <Row className="margin_bottom_20">
                                                                    <Col>
                                                                        <Row>
                                                                            <Col className="center border_only_right border_color_gray">
                                                                                <Row>
                                                                                    <Col
                                                                                        sm="auto"
                                                                                    >{format_date(element.date_movement)}</Col>
                                                                                </Row>
                                                                            </Col>

                                                                            <Col className="center">
                                                                                <Row>
                                                                                    <Col sm="auto">
                                                                                        <strong>{element.responsible_name}</strong>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>

                                                                <DropdownItem divider />

                                                                <Row className="margin_top_20">
                                                                    <Col>

                                                                        <Row>
                                                                            <Col>
                                                                                {
                                                                                    element.hardwares.map((hardware, index) => {
                                                                                        if (element.hardwares.length > 1 && index < element.hardwares.length - 1) {
                                                                                            return (
                                                                                                <div key={hardware.id}>
                                                                                                    <Row className="margin_top_10">
                                                                                                        <Col className="text-center border_only_right border_color_gray">
                                                                                                            <Row>
                                                                                                                <Col>{hardware.category.name}</Col>
                                                                                                            </Row>
                                                                                                            <Row>
                                                                                                                <Col>{hardware.heritage}</Col>
                                                                                                            </Row>
                                                                                                        </Col>

                                                                                                        <Col className="center border_only_right border_color_gray">
                                                                                                            <strong>SAIU DE:&nbsp;</strong>
                                                                                                            <span>{element.previous_department.name}</span>
                                                                                                        </Col>

                                                                                                        <Col className="center">
                                                                                                            <strong>PARA:&nbsp;</strong>
                                                                                                            <span>{element.next_department.name}</span>
                                                                                                        </Col>
                                                                                                    </Row>

                                                                                                    <DropdownItem divider />
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        return (
                                                                                            <Row key={hardware.id} className="margin_top_10">
                                                                                                <Col className="text-center border_only_right border_color_gray">
                                                                                                    <Row>
                                                                                                        <Col>{hardware.category.name}</Col>
                                                                                                    </Row>
                                                                                                    <Row>
                                                                                                        <Col>{hardware.heritage}</Col>
                                                                                                    </Row>
                                                                                                </Col>

                                                                                                <Col className="center border_only_right border_color_gray">
                                                                                                    <strong>SAIU DE:&nbsp;</strong>
                                                                                                    <span>{element.previous_department.name}</span>
                                                                                                </Col>

                                                                                                <Col className="center">
                                                                                                    <strong>PARA:&nbsp;</strong>
                                                                                                    <span>{element.next_department.name}</span>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        );
                                                                                    })
                                                                                }
                                                                            </Col>
                                                                        </Row>

                                                                    </Col>
                                                                </Row>

                                                            </Col>
                                                        </Row>
                                                    </ListGroupItem>
                                                </Link>
                                            </Col>
                                        </Row>
                                    </Container>
                                )
                            })
                            :
                            <Row
                                className="center margin_top_bottom_20"
                            >
                                <Col xs="8" className="text-center">
                                    <h3>Ainda não há movimentações</h3>
                                </Col>
                            </Row>
                }

            </ListGroup>

            {
                movements.rows !== undefined && movements.rows.length !== 0 ?
                    <Pagination
                        className="margin_top_bottom_20 center"
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
        </div>
    );
}