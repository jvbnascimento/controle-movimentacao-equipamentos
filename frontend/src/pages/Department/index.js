import 'bootstrap/dist/css/bootstrap.min.css';

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
    ListGroupItem,
    Input,
    Pagination,
    PaginationLink,
    PaginationItem,
    FormGroup,
    Label,
    FormFeedback,
    Alert
} from 'reactstrap';

import api from '../../services/api';
import AuthContext from '../../contexts/auth';

export default function Department() {
    const [listCategory, setListCategory] = useState([]);
    const [department, setDepartment] = useState({});
    const [departmentName, setDepartmentName] = useState('');
    const [departmentBoss, setDepartmentBoss] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pagesCount, setPageCounts] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [modalDeleteHardware, setModalDeleteHardware] = useState(false);
	const [modalEditDepartment, setModalEditDepartment] = useState(false);
	const [modalDeleteDepartment, setModalDeleteDepartment] = useState(false);
    const [hardwareToDelete, setHardwareToDelete] = useState([-1, -1]);
    const [departmentToDelete, setDepartmentToDelete] = useState([-1, -1]);
    const [validDepartmentName, setValidDepartmentName] = useState(true);
    const [validDepartmentBoss, setValidDepartmentBoss] = useState(true);
	const [visible, setVisible] = useState(false);
    const { message, setMessage } = useContext(AuthContext);

    const search = useParams();
    const history = useHistory();

    useEffect(() => {
        async function getAll() {
            const response = await api.get(`/hardwares/department/${search.name}/${pageSize}/${currentPage}`);
            const data = await response.data;

            setPageCounts(Math.ceil((data.count) / pageSize));
            setListCategory(data);
        }

        getAll();
    }, [search.name, pageSize, currentPage]);

    useEffect(() => {
        async function getDepartment() {
            const response = await api.get(`/departments/name/${search.name}`);
            const data = await response.data;

            setDepartment(data);
            setDepartmentName(data.name);
            setDepartmentBoss(data.boss);
        }

        getDepartment();
    }, [search.name, message]);

    useEffect(() => {
        function verifyMessage() {
            if (message[0] !== '') {
                setVisible(true);
            }
        }

        verifyMessage();
    }, [message]);


    const toggleModalEditDepartment = () => {
        setModalEditDepartment(!modalEditDepartment);
        setDepartmentName(department.name);
        setDepartmentBoss(department.boss);
        setValidDepartmentName(true);
        setValidDepartmentBoss(true);
    }

    const toggleModalDeleteHardware = (e) => {
        setModalDeleteHardware(!modalDeleteHardware)

        if (toggleModalDeleteHardware) {
            setHardwareToDelete([e.target.value, e.target.name]);
        }
        else {
            setHardwareToDelete([-1, -1]);
        }
	};
	
	const toggleModalDeleteDepartment = (e) => {
        setModalDeleteDepartment(!modalDeleteDepartment)

        if (toggleModalDeleteDepartment) {
            setDepartmentToDelete([e.target.value, e.target.name]);
        }
        else {
            setDepartmentToDelete([-1, -1]);
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
	
    const handleDepartmentName = (e) => {
        const verifyDepartmentName = e.target.value;

        if (/^\S.*/gm.exec(verifyDepartmentName)) {
            setValidDepartmentName(true);
        }
        else {
            setValidDepartmentName(false);
        }

        setDepartmentName(verifyDepartmentName);
    }

    const handleDepartmentBoss = (e) => {
        const verifyDepartmentBoss = e.target.value;

        if (/^\S.*/gm.exec(verifyDepartmentBoss)) {
            setValidDepartmentBoss(true);
        }
        else {
            setValidDepartmentBoss(false);
        }

        setDepartmentBoss(verifyDepartmentBoss);
    }

    const cancelEdition = () => {
        setDepartmentName(department.name);
        setDepartmentBoss(department.boss);
        setValidDepartmentName(true);
        setValidDepartmentBoss(true);
        toggleModalEditDepartment();
    }

    const verifyAllInputsValid = () => {
        if (
            /^\S.*/gm.exec(departmentName) &&
            /^\S.*/gm.exec(departmentBoss)
        ) {
            return true;
        }
        return false;
    }

    const onDismiss = () => {
        setVisible(false);
        setMessage(['', -1]);
    }

    const deleteHardware = async () => {
        await api.delete(`/hardwares/${hardwareToDelete[0]}`);

        window.location.reload();
    }

    const deleteDepartment = async () => {
        await api.delete(`/departments/delete/${departmentToDelete[0]}`);

        setMessage(['Departamento deletado com sucesso!', 200]);
        setModalDeleteHardware(!modalDeleteHardware);
        history.push('/');
    }

    const saveEditDepartment = async () => {
        if (verifyAllInputsValid()) {
            const new_data = {
                name: departmentName,
                boss: departmentBoss
            }

            const response = await api.put(`departments/${department.id}`, new_data);

            if (response.data.status === 200) {
                setMessage(['As alterações foram salvas com sucesso!', 200]);
                search.name = departmentName.replace("/", "-");
                history.push(`/department/${search.name}`);
                toggleModalEditDepartment();
            }
            else {
                setMessage([response.data.error, response.data.status]);
                toggleModalEditDepartment();
            }
        }
        else {
            setMessage(["Existem campos não preenchidos corretamente", 400]);
        }
    }

    return (
        <div className={
            listCategory.rows !== undefined &&
                listCategory.rows.length <= 1 ?
                "height_content" : "padding_all_10"
        }>
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

            <h1 className="text-center">
                Informações do departamento
            </h1>
            
			<Container fluid={true} className="width_70 margin_top_bottom_20">
                <ListGroupItem className="">
                    <Row className="text_left">
                        <Col sm="2">
                            <h6>DEPARTAMENTO:</h6>
                        </Col>
                        <Col sm="auto">
                            <h6>{
                                department.name !== undefined &&
                                department.name.replace("-", "/")
                            }</h6>
                        </Col>
                    </Row>
                </ListGroupItem>

                <ListGroupItem>
                    <Row className="text_left">
                        <Col sm="2">
                            <h6>RESPONSÁVEL:</h6>
                        </Col>
                        <Col sm="auto">
                            <h6>{
                                department.boss !== undefined &&
                                department.boss.toUpperCase()
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
                                onClick={toggleModalEditDepartment}
                            >
                                Editar
                            </Button>
                        </Col>
                        <Col sm="auto" className="center">
                            <Button
								color="danger"
								onClick={toggleModalDeleteDepartment}
								value={department.id}
								name={department.name}
                            >
                                Deletar
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
            <Modal isOpen={modalEditDepartment} toggle={toggleModalEditDepartment}>
                <ModalHeader toggle={toggleModalEditDepartment}>
                    Editar informações do departamento: {department.name}
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Label>Departamento</Label>
                        {
                            validDepartmentName ?
                                <>
                                    <Input
                                        value={departmentName}
                                        onChange={handleDepartmentName}
                                        valid
                                    />
                                    <FormFeedback valid>Nome válido</FormFeedback>
                                </>
                                :
                                <>
                                    <Input
                                        value={departmentName}
                                        onChange={handleDepartmentName}
                                        invalid
                                    />
                                    <FormFeedback invalid>O campo <strong>DEPARTAMENTO</strong> não pode ser vazio.</FormFeedback>
                                </>
                        }
                    </FormGroup>

                    <FormGroup>
                        <Label>Responsável</Label>
                        {
                            validDepartmentBoss ?
                                <>
                                    <Input
                                        value={departmentBoss}
                                        onChange={handleDepartmentBoss}
                                        valid
                                    />
                                    <FormFeedback valid>Nome válido</FormFeedback>
                                </>
                                :
                                <>
                                    <Input
                                        value={departmentBoss}
                                        onChange={handleDepartmentBoss}
                                        invalid
                                    />
                                    <FormFeedback invalid>O campo <strong>RESPONSÁVEL</strong> não pode ser vazio.</FormFeedback>
                                </>
                        }

                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button
						className="bg_color_verde_zimbra"
                        onClick={saveEditDepartment}
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

			<Modal isOpen={modalDeleteDepartment} toggle={toggleModalDeleteDepartment}>
                <ModalHeader toggle={toggleModalDeleteDepartment}>Deletar departamento</ModalHeader>
                <ModalBody>
                    Tem certeza que desejar&nbsp;
					<strong className="font_color_danger">DELETAR</strong>
					&nbsp;o departamento&nbsp;
					<strong className="font_color_danger">{departmentToDelete[1]}</strong>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={deleteDepartment}>Sim</Button>
                    <Button className="bg_color_verde_zimbra" onClick={toggleModalDeleteDepartment}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}