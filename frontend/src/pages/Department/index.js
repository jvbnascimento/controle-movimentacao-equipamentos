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
	ListGroupItem
} from 'reactstrap';

import api from '../../services/api';

export default function Department() {
	const search = useParams();

	const [listCategory, setListCategory] = useState([]);

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

	useEffect(() => {
		async function getAll() {
			const response = await api.get(`/hardwares/department/${search.name}/category`);
			const data = await response.data;

			setListCategory(data);
		}

		getAll();
	}, [search.name]);

	async function deleteHardware() {
		await api.delete(`/hardwares/${hardwareToDelete[0]}`);

		window.location.reload();
	}

	return (
		<div className={
			listCategory.rows !== undefined &&
				listCategory.rows.length <= 8 ?
				"height_content" : "padding_all_10"
		}>
			{
				listCategory.rows !== undefined &&
					listCategory.rows.length !== 0 ?
					<Container fluid={true} className="width_70">
						<ListGroupItem className="">
							<Row className="text_left">
								<Col sm="2">
									<h6>DEPARTAMENTO:</h6>
								</Col>
								<Col sm="auto">
									<h6>{search.name}</h6>
								</Col>
							</Row>
						</ListGroupItem>

						<ListGroupItem>
							<Row className="text_left">
								<Col sm="2">
									<h6>RESPONSÁVEL:</h6>
								</Col>
								<Col sm="auto">
									<h6>{listCategory.rows[0].belongs.boss.toUpperCase()}</h6>
								</Col>
							</Row>
						</ListGroupItem>
						
						<ListGroupItem>
							<Row className="text_left">
								<Col sm="auto" className="center">
									<Link
										href="#"
										className="font_color_verde_zimbra_hover"
									>
										Editar
									</Link>
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
					: ''
			}
			<h3 className="margin_top_20 text-center">
				Lista de equipamentos cadastrados ({listCategory.count})
			</h3>

			<Container className="margin_top_20 width_70" fluid={true}>
				<ListGroupItem>
					<Row>
						<Col className="border_only_right padding_all_10 center" sm="2">
							<strong>Tombamento</strong>
						</Col>
						<Col className="border_only_right padding_all_10 center" sm="4">
							<strong>Descrição</strong>
						</Col>
						<Col className="border_only_right padding_all_10 center" sm="2">
							<strong>Categoria</strong>
						</Col>
						<Col className="padding_all_10 center" sm="4">
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
											className="border_only_right padding_all_10 center_vertical"
											sm="2"
										>{element.heritage}</Col>
										<Col
											className="
                                        border_only_right
                                        padding_all_10 center_vertical
                                    "
											sm="4"
										>{element.description}</Col>
										<Col
											className="border_only_right padding_all_10 center_vertical"
											sm="2"
										>{element.category.name}</Col>
										<Col
											className="border_only_right padding_all_10 center"
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