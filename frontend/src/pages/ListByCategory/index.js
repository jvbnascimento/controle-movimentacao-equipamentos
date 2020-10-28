import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect, useContext } from 'react';
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
	Input,
	Pagination,
	PaginationItem,
	PaginationLink,
	ListGroupItem,
	Alert,
} from 'reactstrap';

import api from '../../services/api';
import AuthContext from '../../contexts/auth';

export default function ListByCategory() {
	const search = useParams();

	const [listCategory, setListCategory] = useState([]);
	const [pageSize, setPageSize] = useState(10);
	const [pagesCount, setPageCounts] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [modalDeleteHardware, setModalDeleteHardware] = useState(false);
	
	const [hardwareToDelete, setHardwareToDelete] = useState([-1, -1]);
	
	const [visible, setVisible] = useState(false);
	const { message, setMessage } = useContext(AuthContext);

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
		function verifyMessage() {
			if (message[0] !== '') {
				setVisible(true);
			}
		}

		verifyMessage();
	}, [message]);

	const toggleModalDeleteHardware = (e) => {
		setModalDeleteHardware(!modalDeleteHardware)

		if (toggleModalDeleteHardware) {
			setHardwareToDelete([e.target.value, e.target.name]);
		}
		else {
			setHardwareToDelete([-1, -1]);
		}
	};

	const handleSizePage = (e) => {
		setPageSize(parseInt(e.target.value));
		setPageCounts(Math.ceil(listCategory.count / parseInt(pageSize)));
	}

	const handleCurrentPage = (e, index) => {
		e.preventDefault();
		setCurrentPage(index);
	}

	const deleteHardware = async () => {
		await api.delete(`/hardwares/${hardwareToDelete[0]}`);

		window.location.reload();
	}

	const onDismiss = () => {
        setVisible(false);
        setMessage(['', -1]);
	}

	return (
		<div className={
			listCategory.rows !== undefined &&
				listCategory.rows.length <= 3 ?
				"height_content" : "padding_all_10"
		}>
			{
				listCategory.rows !== undefined &&
					listCategory.rows.length !== 0 ?
					<>
						<Container className="width_30 position_absolute margin_left_35_por">
							<Alert color={
								message[1] === 200 ?
									"success" :
									message[1] !== -1 ?
										"danger"
										: ''
							}
								isOpen={visible}
								toggle={onDismiss}
							>
								{message[0]}
							</Alert>
						</Container>

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
															onClick={toggleModalDeleteHardware}
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

						<Modal isOpen={modalDeleteHardware} toggle={toggleModalDeleteHardware}>
							<ModalHeader toggle={toggleModalDeleteHardware}>Deletar equipamento</ModalHeader>
							<ModalBody>
								Tem certeza que desejar&nbsp;
								<strong className="font_color_danger">DELETAR</strong>
								&nbsp;o equipamento de tombo&nbsp;
								<strong className="font_color_danger">{hardwareToDelete[1]}</strong>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" onClick={deleteHardware}>Sim</Button>
								<Button className="bg_color_verde_zimbra" onClick={toggleModalDeleteHardware}>Cancelar</Button>
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

			<Modal isOpen={modalDeleteHardware} toggle={toggleModalDeleteHardware}>
				<ModalHeader toggle={toggleModalDeleteHardware}>Deletar equipamento</ModalHeader>
				<ModalBody>
					Tem certeza que desejar&nbsp;
					<strong className="font_color_danger">DELETAR</strong>
					&nbsp;o equipamento de tombo&nbsp;
					<strong className="font_color_danger">{hardwareToDelete[1]}</strong>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" onClick={deleteHardware}>Sim</Button>
					<Button className="bg_color_verde_zimbra" onClick={toggleModalDeleteHardware}>Cancelar</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}