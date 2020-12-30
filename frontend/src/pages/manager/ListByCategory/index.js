import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import {
	Container,
	Row,
	Col,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Pagination,
	PaginationItem,
	PaginationLink,
	ListGroupItem,
    Alert,
    FormFeedback,
    FormGroup,
    Label
} from 'reactstrap';

import api from '../../../services/api';
import AuthContext from '../../../contexts/auth';

export default function ListByCategory() {
	const search = useParams();
    const [category, setCategory] = useState(Object);
    const [categoryName, setCategoryName] = useState('');
	const [listCategory, setListCategory] = useState([]);
	const [pageSize, setPageSize] = useState(10);
	const [pagesCount, setPageCounts] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
    const [modalEditCategory, setModalEditCategory] = useState(false);
    const [validCategoryName, setValidCategoryName] = useState(true);
	const [visible, setVisible] = useState(false);
    const { message, setMessage, colorMessage } = useContext(AuthContext);

    const history = useHistory();

	useEffect(() => {
		async function getAll() {
			const response = await api.get(`/hardwares/category/${search.category}/${pageSize}/${currentPage}`);
			const data = await response.data;

			setPageCounts(Math.ceil((data.count) / pageSize));
			setListCategory(data);
		}

		getAll();
    }, [search.category, pageSize, currentPage]);
    
    useEffect(() => {
		async function getCategory() {
			const response = await api.get(`/types/category_name/${search.category}`);
            const data = await response.data;
            
            setCategory(data.type);
            setCategoryName(data.type.name);
            setValidCategoryName(false);
		}

		getCategory();
    }, [search.category]);

    useEffect(() => {
		async function getCategory() {
            if (categoryName !== '') {
                const response = await api.get(`/types/verify_name/${categoryName}`);
                const data = response.data;

                setValidCategoryName(data.name_exists);
            }
		}

		getCategory();
	}, [categoryName]);

	useEffect(() => {
		function verifyMessage() {
			if (message[0] !== '') {
				setVisible(true);
			}
		}

		verifyMessage();
	}, [message]);

	const handleSizePage = (e) => {
		setPageSize(parseInt(e.target.value));
		setPageCounts(Math.ceil(listCategory.count / parseInt(pageSize)));
	}

	const handleCurrentPage = (e, index) => {
		e.preventDefault();
		setCurrentPage(index);
	}

	const onDismiss = () => {
        setVisible(false);
        setMessage(['', -1]);
    }
    
    const toggleModalEditCategory = () => {
        setModalEditCategory(!modalEditCategory);
        setCategoryName(category.name);
        setValidCategoryName(true);
    }

    const handleCategoryName = (e) => {
        if (e.target.value === '') {
			setValidCategoryName(false);
        }
        
        setCategoryName(e.target.value);
    }

    const cancelEdition = () => {
        setCategoryName(category.name);
        setValidCategoryName(true);
        toggleModalEditCategory();
    }

    const verifyAllInputsValid = () => {
        if (
            /^\S.*/gm.exec(categoryName) &&
            !validCategoryName
        ) {
            return true;
        }
        return false;
    }

    const saveEditCategory = async () => {
        if (verifyAllInputsValid()) {
            const new_data = {
                name: categoryName,
            }

            const response = await api.put(`types/${category.id}`, new_data);

            if (response.data.status === 200) {
                setMessage(['As alterações foram salvas com sucesso!', 200]);
                search.category = categoryName;
                history.push(`/hardware/${search.category}`);
                toggleModalEditCategory();
            }
            else {
                setMessage([response.data.error, response.data.status]);
                toggleModalEditCategory();
            }
        }
        else {
            setMessage(["Existem campos não preenchidos corretamente", 400]);
            toggleModalEditCategory();
        }
    }

	return (
		<div className="padding_all_10">
            <Container className="width_30 position_absolute margin_left_35_por">
                <Alert color={colorMessage[message[1]]}
                    isOpen={visible}
                    toggle={onDismiss}>
                    {message[0]}
                </Alert>
            </Container>

            <h1 className="text-center">Informações da categoria</h1>
            
			<Container fluid={true} className="width_70 margin_top_bottom_20">
                <ListGroupItem className="">
                    <Row className="text_left">
                        <Col sm="2">
                            <h6>CATEGORIA:</h6>
                        </Col>
                        <Col sm="auto">
                            <h6>{
                                category.name !== undefined && category.name
                            }</h6>
                        </Col>
                    </Row>
                </ListGroupItem>

                <ListGroupItem>
                    <Row className="text_left">
                        <Col sm="auto" className="center">
                            <Button
                                className="
									font_color_verde_zimbra_hover
									bg_color_transparent
									no_border
									text_undeline
								"
                                onClick={toggleModalEditCategory}
                            >
                                Editar
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
										sm="6"
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
										sm="2"
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
											<ListGroupItem
												className="margin_top_bottom_10"
												key={element.id}
											>
												<Row
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
													>{element.code}</Col>
													<Col
														className="
                                                            border_only_right
                                                            padding_all_10 center_vertical
                                                            border_color_gray
                                                        "
														sm="6"
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
														className="padding_all_10 center"
														sm="2"
													>
														<Link
															className="font_color_verde_zimbra_hover"
															to={`/hardware/edit/${element.id}`}
														>Editar</Link>
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

            <Modal isOpen={modalEditCategory} toggle={toggleModalEditCategory}>
                <ModalHeader toggle={toggleModalEditCategory}>
                    Editar informações da categoria: {category.name}
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Label>Categoria</Label>
                        {
                            !validCategoryName ?
                                categoryName !== '' ?
                                <>
                                    <Input
                                        value={categoryName}
                                        onChange={handleCategoryName}
                                        valid
                                    />
                                    <FormFeedback valid>Nome válido</FormFeedback>
                                </>
                                :
                                <>
                                    <Input
                                        value={categoryName}
                                        onChange={handleCategoryName}
                                        invalid
                                    />
                                    <FormFeedback>O campo <strong>CATEGORIA</strong> não pode ser vazio.</FormFeedback>
                                </>
                                :
                                <>
                                    <Input
                                        value={categoryName}
                                        onChange={handleCategoryName}
                                        invalid
                                    />
                                    <FormFeedback>Já existe uma <strong>CATEGORIA</strong> com o nome informado.</FormFeedback>
                                </>
                        }
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button
						className="bg_color_verde_zimbra"
                        onClick={saveEditCategory}
                    >
                        Salvar Alterações
					</Button>{' '}
                    <Button
                        color="secondary"
                        onClick={cancelEdition}
                    >
                        Cancelar
					</Button>
                </ModalFooter>
            </Modal>
		</div>
	);
}