import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

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
    ListGroupItem,
    Alert
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';
import PaginationComponent from '../../../components/Pagination'

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

export default function Hardware() {
    const [hardware, setHardwares] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pagesCount, setPageCounts] = useState(0);
    const [pageNeighbours, setPageNeighbours] = useState(1);
    const [pages, setPages] = useState([]);
    const [querySearch, setQuerySearch] = useState('');
    const [cSelected, setCSelected] = useState([]);
    const [modal, setModal] = useState(false);
    const [hardwareToDelete, setHardwareToDelete] = useState([-1, -1]);
    const [visible, setVisible] = useState(false);

    const [codeFilter, setCodeFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [warrantyFilter, setWarrantyFilter] = useState('');
    const [hasOfficeFilter, setHasOfficeFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [belongsFilter, setBelongsFilter] = useState('');

    const { message, setMessage, colorMessage } = useContext(AuthContext);

    const filteredTraduction = {
        code: 'Tombamento',
        brand: 'Marca',
        warranty: 'Garantia',
        has_office: 'Office',
        category: 'Categoria',
        belongs: 'Departamento'
    }

    const filteredFunctions = {
        code: function handleCodeFilter(e) {
            setCodeFilter(e.target.value);
        },
        brand: function handleBrandFilter(e) {
            setBrandFilter(e.target.value);
        },
        warranty: function handleWarrantyFilter(e) {
            setWarrantyFilter(e.target.value);
        },
        has_office: function handleHasOfficeFilter(e) {
            setHasOfficeFilter(e.target.value);
        },
        category: function handleCategoryFilter(e) {
            setCategoryFilter(e.target.value);
        },
        belongs: function handleDepartmentFilter(e) {
            setBelongsFilter(e.target.value);
        }
    }

    const filteredValues = {
        code: codeFilter,
        brand: brandFilter,
        warranty: warrantyFilter,
        category: categoryFilter,
        belongs: belongsFilter
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

        async function getAllHardwares() {
            const response = await api.get(`/hardwares/${pageSize}/${currentPage}/filters?${querySearch}`);
            const data = await response.data.hardwares;

            if (data) {
                setPageCounts(Math.ceil((data.count) / pageSize));
                setPageNeighbours(Math.max(0, Math.min(pageNeighbours, 2)));
                setHardwares(data);
            }
        }

        getAllHardwares();
        setPages(fetchPageNumbers());
    }, [pageSize, currentPage, pageNeighbours, querySearch, message, pagesCount]);

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
        categoryFilter,
        belongsFilter
    ]);

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

    const handleCurrentPage = (e, page) => {
        e.preventDefault();
        setCurrentPage(Math.max(0, Math.min(page, pagesCount)));
    }

    const handleSizePage = (e) => {
        setPageSize(parseInt(e.target.value));
        setPageCounts(Math.ceil(hardware.count / parseInt(pageSize)));
        setCurrentPage(1);
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
        const response = await api.delete(`/hardwares/${hardwareToDelete[0]}`);

        if (response.status === 204) {
            setMessage([`Equipamento de tombo ${hardwareToDelete[1]} foi deletado com sucesso`, response.status]);
            setHardwareToDelete([-1, -1]);
            setModal(!modal);
        }
        else {
            setMessage([`${response.data}`, response.status]);
            setHardwareToDelete([-1, -1]);
            setModal(!modal);
        }
    }

    return (
        <div className={hardware.rows !== undefined && hardware.rows.length !== 0 ? "" : "height_content"}>
            <Container className="width_30">
                <Alert color={colorMessage[message[1]]} isOpen={visible} toggle={onDismiss}>
                    {message[0]}
                </Alert>
            </Container>

            <Container className="margin_bottom_30 padding_all_10" fluid={true}>
                <Row sm="auto" className="no_margin">
                    <Col sm="auto">
                        <Link to="/hardware/create" className="font_color_verde_zimbra_hover" title="Cadastrar novo equipamento">
                            <BsPlusCircleFill size="40" />
                        </Link>
                    </Col>
                </Row>
            </Container>

            <Container className="margin_bottom_30">
                <Row>
                    <Col className="center">
                        <ButtonGroup className="margin_bottom_20">
                            <Button onClick={() => onCheckboxBtnClick('code')} active={cSelected.includes('code')} title="Filtrar por tombamento" className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Tombamento
                            </Button>

                            <Button onClick={() => onCheckboxBtnClick('brand')} active={cSelected.includes('brand')} title="Filtrar por marca" className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Marca
                            </Button>

                            <Button onClick={() => onCheckboxBtnClick('warranty')} active={cSelected.includes('warranty')} title="Filtrar por garantia" className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Garantia
                            </Button>

                            <Button onClick={() => onCheckboxBtnClick('has_office')} active={cSelected.includes('has_office')} title="Filtrar por ferramenta office" className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Office
                            </Button>

                            <Button onClick={() => onCheckboxBtnClick('category')} active={cSelected.includes('category')} title="Filtrar por categoria" className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Categoria
                            </Button>

                            <Button onClick={() => onCheckboxBtnClick('belongs')} active={cSelected.includes('belongs')} title="Filtrar por departamento" className="margin_left_right_05 border_color_verde_zimbra_hover bg_color_verde_zimbra">
                                Departamento
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>

                <Row>
                    {
                        cSelected && cSelected.length !== 0 &&
                        cSelected.map((element, index) => {
                            return (
                                <Col key={index}>
                                    <Container>
                                        <Row>
                                            <Col className="center">
                                                <Input type="text" name={element} placeholder={filteredTraduction[element]} className="background_color_white_zimbra" onChange={filteredFunctions[element]} />
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                            );
                        })
                    }
                </Row>
            </Container>

            {hardware.rows !== undefined && hardware.rows.length !== 0 &&
                <Container className="center margin_top_30">
                    <Row>
                        <Col>
                            <Container>
                                <Row>
                                    <Col sm="16">
                                        <h1 className="text-center"> Lista de equipamentos cadastrados ({hardware.count}) </h1>
                                    </Col>
                                </Row>

                                <Row className="right margin_top_10">
                                    <Col>
                                        <span>Quantidade de itens mostrados</span>
                                    </Col>
                                    <Col sm="auto">
                                        <Input type="select" name="pageSize" id="labelPageSize" value={pageSize} onChange={handleSizePage}>
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
            }

            {
                hardware.rows !== undefined &&
                hardware.rows.length !== 0 &&
                <PaginationComponent
                    pages={pages}
                    left={LEFT_PAGE}
                    right={RIGHT_PAGE}
                    currentPage={currentPage}
                    handleCurrentPage={handleCurrentPage}
                    pageNeighbours={pageNeighbours}
                    pagesCount={pagesCount}
                />
            }

            {
                hardware.rows !== undefined && hardware.rows.length !== 0 &&
                <Container fluid={true} className="margin_top_20 width_80 padding_all_10">
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
                            <Col sm="2" className="border_only_right padding_all_10 center border_color_gray">
                                <strong>Departamento</strong>
                            </Col>
                            <Col sm="2" className="padding_all_10 center">
                                <strong>Ações</strong>
                            </Col>
                        </Row>
                    </ListGroupItem>
                </Container>
            }

            <Container className="width_80 padding_all_10" fluid={true}>
                {
                    hardware.rows !== undefined && hardware.rows.length !== 0 ?
                        hardware.rows.map(element => {
                            return (
                                <ListGroupItem key={element.id}>
                                    <Row className="center">
                                        <Col sm="2" className="padding_all_10 center_vertical">
                                            <span>{element.code}</span>
                                        </Col>
                                        {
                                            element.belongs.acronym === "CSA/INSERVÍVEL" ?
                                                <Col sm="4" className="padding_all_10 border border_color_vermelho_danger">
                                                    <span>{element.description}</span>
                                                </Col>
                                                :
                                                element.belongs.acronym === "COTEC/INFRA" ?
                                                    <Col sm="4" className="padding_all_10 border border_color_azul_info">
                                                        <span>{element.description}</span>
                                                    </Col>
                                                    :
                                                    <Col sm="4" className="padding_all_10 border border_color_amarelo_warning">
                                                        <span>{element.description}</span>
                                                    </Col>
                                        }
                                        <Col sm="2" className="padding_all_10 border_only_right center_vertical border_color_gray">
                                            <span>{element.category !== null && element.category.name}</span>
                                        </Col>
                                        <Col sm="2" className="padding_all_10 border_only_right center_vertical border_color_gray">
                                            <span>{element.belongs !== null && element.belongs.acronym}</span>
                                        </Col>
                                        <Col sm="1" className="padding_all_10 border_only_right center border_color_gray">
                                            <Link to={`/hardware/edit/${element.id}`} className="font_color_verde_zimbra_hover">
                                                Editar
                                            </Link>
                                        </Col>
                                        <Col sm="1" className="center">
                                            <Button onClick={toggle} color="danger" value={element.id} name={element.code}>
                                                Deletar
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            );
                        })
                        :
                        <Row className="margin_top_bottom_20 center">
                            <Col sm="auto" className="text-center">
                                <h3>Não há equipamentos registrados ainda</h3>
                            </Col>
                        </Row>
                }
            </Container>

            {
                hardware.rows !== undefined &&
                hardware.rows.length !== 0 &&
                <PaginationComponent
                    pages={pages}
                    left={LEFT_PAGE}
                    right={RIGHT_PAGE}
                    currentPage={currentPage}
                    handleCurrentPage={handleCurrentPage}
                    pageNeighbours={pageNeighbours}
                    pagesCount={pagesCount}
                />
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