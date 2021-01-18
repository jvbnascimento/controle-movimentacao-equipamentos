import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Row,
    Col,
    ListGroupItem,
    ListGroup,
    Input,
    ButtonGroup,
    Button,
    DropdownItem,
    Alert
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';
import PaginationComponent from '../../../components/Pagination';

import api from '../../../services/api';
import AuthContext from '../../../contexts/auth';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

const range = (from, to, step = 1) => {
    let i = from;
    const range = [];

    while (i <= to) {
        range.push(i);
        i += step;
    }

    return range;
}

export default function Movements() {
    const [movements, setMovements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pagesCount, setPageCounts] = useState(0);
    const [pageNeighbours, setPageNeighbours] = useState(1);
    const [pages, setPages] = useState([]);
    const [querySearch, setQuerySearch] = useState('');
    const [cSelected, setCSelected] = useState([]);
	const [visible, setVisible] = useState(false);
	
	const [codeFilter, setCodeFilter] = useState('');
	const [brandFilter, setBrandFilter] = useState('');
	const [warrantyFilter, setWarrantyFilter] = useState('');
	const [hasOfficeFilter, setHasOfficeFilter] = useState('');
	const [auctionFilter, setAuctionFilter] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('');
	const [belongsFilter, setBelongsFilter] = useState('');
	const [dateMovementFilter, setDateMovementFilter] = useState('');

	const { message, setMessage, colorMessage } = useContext(AuthContext);
	
	const filteredTraduction = {
		code: 'Tombamento',
		brand: 'Marca',
		warranty: 'Garantia',
		has_office: 'Office',
		auction: 'Leilão',
		category: 'Categoria',
		belongs: 'Departamento',
		date_movement: 'Data'
	}

	const filteredFunctions = {
		code: function handleCodeFilter (e) {
			setCodeFilter(e.target.value);
		},
		brand: function handleBrandFilter (e) {
			setBrandFilter(e.target.value);
		},
		warranty: function handleWarrantyFilter (e) {
			setWarrantyFilter(e.target.value);
		},
		has_office: function handleHasOfficeFilter (e) {
			setHasOfficeFilter(e.target.value);
		},
		auction: function handleAuctionFilter (e) {
			setAuctionFilter(e.target.value);
		},
		category: function handleCategoryFilter (e) {
			setCategoryFilter(e.target.value);
		},
		belongs: function handleDepartmentFilter (e) {
			setBelongsFilter(e.target.value);
		},
		date_movement: function handleDateFilte (e) {
			setDateMovementFilter(e.target.value);
		}
	}

	const filteredValues = {
		code: codeFilter,
		brand: brandFilter,
		warranty: warrantyFilter,
		has_office: hasOfficeFilter,
		auction: auctionFilter,
		category: categoryFilter,
		belongs: belongsFilter,
		date_movement: dateMovementFilter
	}

    useEffect(() => {
        const fetchPageNumbers = () => {
            const totalNumbers = (pageNeighbours * 2) + 3;
            const totalBlocks = totalNumbers + 2;

            if (pagesCount > totalBlocks) {
                const startPage = Math.max(2, currentPage - pageNeighbours);
                const endPage = Math.min(pagesCount - 1, currentPage + pageNeighbours);
                let pages = range(startPage, endPage);

                const hasLeftSpill = startPage > 2;
                const hasRightSpill = (pagesCount - endPage) > 1;
                const spillOffset = totalNumbers - (pages.length + 1);

                switch (true) {
                    case (hasLeftSpill && !hasRightSpill): {
                        const extraPages = range(startPage - spillOffset, startPage - 1);
                        pages = [LEFT_PAGE, ...extraPages, ...pages];
                        break;
                    }

                    case (!hasLeftSpill && hasRightSpill): {
                        const extraPages = range(endPage + 1, endPage + spillOffset);
                        pages = [...pages, ...extraPages, RIGHT_PAGE];
                        break;
                    }

                    case (hasLeftSpill && hasRightSpill):
                    default: {
                        pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
                        break;
                    }
                }

                return [1, ...pages, pagesCount];
            }

            return range(1, pagesCount);
        }

        async function filteredSearch() {
            const response = await api.get(`/movements/${pageSize}/${currentPage}/filters?${querySearch}`);
            const data = await response.data.movements;

            if (data) {
                setPageCounts(Math.ceil((data.count) / pageSize));
                setPageNeighbours(Math.max(0, Math.min(pageNeighbours, 2)));
                setMovements(data);
            }
        }

        filteredSearch();
        setPages(fetchPageNumbers());
    }, [querySearch, currentPage, pageSize, pageNeighbours, pagesCount]);

    useEffect(() => {
        function verifyMessage() {
            if (message[0] !== '') {
                setVisible(true);
            }
        }

        verifyMessage();
	}, [message]);
	
	useEffect(() => {
        function handleQuerySearch() {
            const body = cSelected.map(element => {
				return (filteredValues[element]);
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

        handleQuerySearch();
	}, [cSelected,
		filteredValues,
		codeFilter,
		brandFilter,
		warrantyFilter,
		hasOfficeFilter,
		auctionFilter,
		categoryFilter,
		belongsFilter,
		dateMovementFilter]);

    const onDismiss = () => {
        setVisible(false);
        setMessage(['', -1]);
    }

    function handleCurrentPage(e, page) {
        e.preventDefault();
        setCurrentPage(Math.max(0, Math.min(page, pagesCount)));
    }

    function handleSizePage(e) {
        setPageSize(parseInt(e.target.value));
        setPageCounts(Math.ceil(movements.count / parseInt(pageSize)));
        setCurrentPage(1);
    }

    function format_date(date) {
        const data_auxiliar = date.split("T");
        const data = data_auxiliar[0].split("-");

        const new_data = data[2] + "/" + data[1] + "/" + data[0];

        return (new_data);
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
        <div className={movements.rows !== undefined && movements.rows.length !== 0 ? '' : 'height_content'}>
            <Container className="width_30">
                <Alert
                    color={colorMessage[message[1]]}
                    isOpen={visible}
                    toggle={onDismiss}>
                    {message[0]}
                </Alert>
            </Container>

            <Container fluid={true} className="margin_bottom_30 padding_all_10">
                <Row sm="auto" className="no_margin">
                    <Col sm="auto">
                        <Link
                            to="/movement/create"
                            title="Cadastrar nova movimentação"
                            className="font_color_verde_zimbra_hover">
                            <BsPlusCircleFill size="40" />
                        </Link>
                    </Col>
                </Row>
            </Container>

            <Container className="margin_bottom_30">
                <Row>
                    <Col className="center">
                        <ButtonGroup className="margin_bottom_20">
                            <Button
                                onClick={() => onCheckboxBtnClick('code')}
                                active={cSelected.includes('code')}
                                title="Filtrar por tombamento"
                                className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Tombamento
                            </Button>

                            <Button
                                onClick={() => onCheckboxBtnClick('brand')}
                                active={cSelected.includes('brand')}
                                title="Filtrar por marca"
                                className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Marca
                            </Button>

                            <Button
                                onClick={() => onCheckboxBtnClick('warranty')}
                                active={cSelected.includes('warranty')}
                                title="Filtrar por garantia"
                                className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Garantia
                            </Button>

                            <Button
                                onClick={() => onCheckboxBtnClick('has_office')}
                                active={cSelected.includes('has_office')}
                                title="Filtrar por ferramenta office"
                                className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Office
                            </Button>

                            <Button
                                onClick={() => onCheckboxBtnClick('auction')}
                                active={cSelected.includes('auction')}
                                title="Filtrar por máquinas leiloadas"
                                className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Leilão
                            </Button>

                            <Button
                                onClick={() => onCheckboxBtnClick('category')}
                                active={cSelected.includes('category')}
                                title="Filtrar por categoria"
                                className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Categoria
                            </Button>

                            <Button
                                onClick={() => onCheckboxBtnClick('belongs')}
                                active={cSelected.includes('belongs')}
                                title="Filtrar por departamento"
                                className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Departamento
                            </Button>

                            <Button
                                onClick={() => onCheckboxBtnClick('date_movement')}
                                active={cSelected.includes('date_movement')}
                                title="Filtrar por data"
                                className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Data
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>

                <Row>
                    {cSelected && cSelected.length !== 0 &&
                        cSelected.map((element, index) => {
                            return (
                                <Col key={index}>
                                    <Container>
                                        <Row>
                                            <Col className="center">
                                                <Input
                                                    type="text"
                                                    name={element}
                                                    placeholder={filteredTraduction[element]}
                                                    className="background_color_white_zimbra"
													onChange={filteredFunctions[element]}
                                                />
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                            );
                        })
                    }
                </Row >
            </Container >

            {
                movements.rows !== undefined && movements.rows.length !== 0 &&
                <Container className="center margin_top_30">
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
                                            onChange={handleSizePage}>
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
            }

            {
                movements.rows !== undefined && movements.rows.length !== 0 &&
                <PaginationComponent
                    pages={pages}
                    currentPage={currentPage}
                    handleCurrentPage={handleCurrentPage}
                    pageNeighbours={pageNeighbours}
                    pagesCount={pagesCount}
                />
            }

            <ListGroup className="padding_all_10">
                {movements.rows !== undefined && movements.rows.length !== 0 ?
                    movements.rows.map(element => {
                        return (
                            <Container key={element.id}>
                                <Row className="center margin_top_bottom_20">
                                    <Col>
                                        <Link
                                            to={`/movement/edit/${element.id}`}
                                            className="font_color_black_hover no_padding">
                                            <ListGroupItem>
                                                <Row>
                                                    <Col
                                                        sm="auto"
                                                        className="center border_only_right border_color_gray">
                                                        {element.id}
                                                    </Col>
                                                    <Col>
                                                        <Row className="margin_bottom_20">
                                                            <Col>
                                                                <Row>
                                                                    <Col className="center border_only_right border_color_gray">
                                                                        <Row>
                                                                            <Col sm="auto">
                                                                                {format_date(element.date_movement)}
                                                                            </Col>
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
                                                                        {element.hardwares.map((hardware, index) => {
                                                                            if (element.hardwares.length > 1 && index < element.hardwares.length - 1) {
                                                                                return (
                                                                                    <div key={hardware.id}>
                                                                                        <Row className="margin_top_10">
                                                                                            <Col className="text-center border_only_right border_color_gray">
                                                                                                <Row>
                                                                                                    <Col>{hardware.category.name}</Col>
                                                                                                </Row>
                                                                                                <Row>
                                                                                                    <Col>{hardware.code}</Col>
                                                                                                </Row>
                                                                                            </Col>

                                                                                            <Col className="center border_only_right border_color_gray">
                                                                                                <strong>DE:&nbsp;</strong>
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
                                                                                            <Col>{hardware.code}</Col>
                                                                                        </Row>
                                                                                    </Col>

                                                                                    <Col className="center border_only_right border_color_gray">
                                                                                        <strong>DE:&nbsp;</strong>
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
                    movements.rows !== undefined && movements.rows.length !== 0 ?
                        movements.rows.map(element => {
                            return (
                                <Container key={element.id}>
                                    <Row className="center margin_top_bottom_20">
                                        <Col>
                                            <Link
                                                to={`/movement/edit/${element.id}`}
                                                className="font_color_black_hover no_padding">
                                                <ListGroupItem>
                                                    <Row>
                                                        <Col
                                                            sm="auto"
                                                            className="center border_only_right border_color_gray">
                                                            {element.id}
                                                        </Col>
                                                        <Col>
                                                            <Row className="margin_bottom_20">
                                                                <Col>
                                                                    <Row>
                                                                        <Col className="center border_only_right border_color_gray">
                                                                            <Row>
                                                                                <Col sm="auto">
                                                                                    {format_date(element.date_movement)}
                                                                                </Col>
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
                                                                            {element.hardwares.map((hardware, index) => {
                                                                                if (element.hardwares.length > 1 && index < element.hardwares.length - 1) {
                                                                                    return (
                                                                                        <div key={hardware.id}>
                                                                                            <Row className="margin_top_10">
                                                                                                <Col className="text-center border_only_right border_color_gray">
                                                                                                    <Row>
                                                                                                        <Col>{hardware.category.name}</Col>
                                                                                                    </Row>
                                                                                                    <Row>
                                                                                                        <Col>{hardware.code}</Col>
                                                                                                    </Row>
                                                                                                </Col>

                                                                                                <Col className="center border_only_right border_color_gray">
                                                                                                    <strong>DE:&nbsp;</strong>
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
                                                                                                <Col>{hardware.code}</Col>
                                                                                            </Row>
                                                                                        </Col>

                                                                                        <Col className="center border_only_right border_color_gray">
                                                                                            <strong>DE:&nbsp;</strong>
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
                        <Row className="margin_top_bottom_20 width_100 center">
                            <Col sm="auto" className="text-center">
                                <h3>Não há movimentações registradas ainda</h3>
                            </Col>
                        </Row>
                }

            </ListGroup>

            {
                movements.rows !== undefined && movements.rows.length !== 0 &&
                <PaginationComponent
                    pages={pages}
                    currentPage={currentPage}
                    handleCurrentPage={handleCurrentPage}
                    pageNeighbours={pageNeighbours}
                    pagesCount={pagesCount}
                />
            }
        </div >
    );
}