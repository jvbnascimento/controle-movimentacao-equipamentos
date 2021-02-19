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
    ListGroupItem,
    Input,
    FormGroup,
    Label,
    FormFeedback,
    Alert
} from 'reactstrap';

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

export default function Department() {
    const [listHardwares, setListHardwares] = useState([]);
    const [department, setDepartment] = useState({});
    const [departmentName, setDepartmentName] = useState('');
    const [departmentAcronym, setDepartmentAcronym] = useState('');
    const [departmentBoss, setDepartmentBoss] = useState('');
    const [validDepartmentName, setValidDepartmentName] = useState(true);
    const [validDepartmentAcronym, setValidDepartmentAcronym] = useState(true);
    const [validDepartmentBoss, setValidDepartmentBoss] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [pagesCount, setPageCounts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNeighbours, setPageNeighbours] = useState(1);
    const [pages, setPages] = useState([]);
    const [modalDeleteHardware, setModalDeleteHardware] = useState(false);
    const [modalEditDepartment, setModalEditDepartment] = useState(false);
    const [modalDeleteDepartment, setModalDeleteDepartment] = useState(false);
    const [hardwareToDelete, setHardwareToDelete] = useState([-1, -1]);
    const [departmentToDelete, setDepartmentToDelete] = useState([-1, -1]);

    const [visible, setVisible] = useState(false);
    const { message, setMessage, colorMessage } = useContext(AuthContext);

    const search = useParams();
    const history = useHistory();

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

        async function getAll() {
            const response = await api.get(`/hardwares/department/department_acronym/${search.name}/${pageSize}/${currentPage}`);
            const data = await response.data.hardwares;

            setPageCounts(Math.ceil((data.count) / pageSize));
            setPageNeighbours(Math.max(0, Math.min(pageNeighbours, 2)));
            setListHardwares(data);
        }

        getAll();
        setPages(fetchPageNumbers());
    }, [search.name, pageSize, currentPage, pagesCount, pageNeighbours, message]);

    useEffect(() => {
        async function getDepartment() {
            const response = await api.get(`/departments/acronym/${search.name}`);
            const data = await response.data.department;

            setDepartment(data);
            setDepartmentName(data.name);
            setDepartmentAcronym(data.acronym);
            setDepartmentBoss(data.boss);
        }

        getDepartment();
    }, [search.name, message]);

    useEffect(() => {
        async function getDepartment() {
            if (departmentName !== '' && departmentName !== undefined) {
                const response = await api.get(`/departments/verify_name/${departmentName}`);
                const data = response.data;

                if (data.name_exists && departmentName === department.name) {
                    setValidDepartmentName(true);
                }
                else if (data.name_exists && departmentName !== department.name) {
                    setValidDepartmentName(false);
                }
                else {
                    setValidDepartmentName(true);
                }
            }
        }

        getDepartment();
    }, [departmentName, department.name]);

    useEffect(() => {
        async function getDepartment() {
            if (departmentAcronym !== '' && departmentAcronym !== undefined) {
                const response = await api.get(`/departments/verify_acronym/${departmentAcronym.replace("/", "-")}`);
                const data = response.data;

                if (data.acronym_exists && departmentAcronym === department.acronym) {
                    setValidDepartmentAcronym(true);
                }
                else if (data.acronym_exists && departmentAcronym !== department.acronym) {
                    setValidDepartmentAcronym(false);
                }
                else {
                    setValidDepartmentAcronym(true);
                }
            }
        }

        getDepartment();
    }, [departmentAcronym, department.acronym]);

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

    function handleCurrentPage(e, page) {
        e.preventDefault();
        setCurrentPage(Math.max(0, Math.min(page, pagesCount)));
    }

    function handleSizePage(e) {
        setPageSize(parseInt(e.target.value));
        setPageCounts(Math.ceil(listHardwares.count / parseInt(pageSize)));
        setCurrentPage(1);
    }

    const handleDepartmentName = (e) => {
        const verifyDepartmentName = e.target.value.toUpperCase();

        if (verifyDepartmentName === '') {
            setValidDepartmentName(false);
        }

        setDepartmentName(verifyDepartmentName);
    }

    const handleDepartmentAcronym = (e) => {
        const verifyDepartmentAcronym = e.target.value.toUpperCase();

        if (verifyDepartmentAcronym === '') {
            setValidDepartmentAcronym(false);
        }

        setDepartmentAcronym(verifyDepartmentAcronym);
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
        setDepartmentAcronym(department.acronym);
        setDepartmentBoss(department.boss);
        setValidDepartmentName(true);
        setValidDepartmentAcronym(true);
        setValidDepartmentBoss(true);
        toggleModalEditDepartment();
    }

    const verifyAllInputsValid = () => {
        if (
            /^\S.*/gm.test(departmentName) &&
            /^\S.*/gm.test(departmentAcronym) &&
            /^\S.*/gm.test(departmentBoss) &&
            validDepartmentName &&
            validDepartmentAcronym &&
            validDepartmentBoss
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
        const response = await api.delete(`/hardwares/${hardwareToDelete[0]}`);

        if (response.status === 204) {
            setMessage([`Equipamento de tombamento: ${hardwareToDelete[0]} foi excluído com sucesso!`, response.status]);
            setHardwareToDelete([-1, -1]);
            setModalDeleteHardware(!modalDeleteHardware);
        }
        else {
            setMessage([response.data, response.status]);
            setHardwareToDelete([-1, -1]);
            setModalDeleteHardware(!modalDeleteHardware);
        }
    }

    const deleteDepartment = async () => {
        const response = await api.delete(`/departments/delete/${departmentToDelete[0]}`);

        if (response.status === 204) {
            setMessage(['Departamento deletado com sucesso!', 200]);
            setDepartmentToDelete([-1, -1]);
            setModalDeleteDepartment(!modalDeleteDepartment);
            history.push('/');
        }
        else {
            setMessage([response.data, response.status]);
            setDepartmentToDelete([-1, -1]);
            setModalDeleteDepartment(!modalDeleteDepartment);
        }
    }

    const saveEditDepartment = async () => {
        if (verifyAllInputsValid()) {
            const new_data = {
                name: departmentName,
                acronym: departmentAcronym,
                boss: departmentBoss
            }

            const response = await api.put(`departments/update/${department.id}`, new_data);

            if (response.data.status === 200) {
                setMessage(['As alterações foram salvas com sucesso!', 200]);
                search.name = departmentName.replace("/", "-").toUpperCase();
                setDepartmentName('');
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
        <div className={listHardwares.rows !== undefined && listHardwares.rows.length <= 0 ? "height_content" : "padding_all_10"}>
            <Container className="width_30 position_absolute margin_left_35_por">
                <Alert color={colorMessage[message[1]]} isOpen={visible} toggle={onDismiss}>
                    {message[0]}
                </Alert>
            </Container>

            <h1 className="text-center">Informações do departamento</h1>

            <Container fluid={true} className="width_70 margin_top_bottom_20">
                <ListGroupItem className="">
                    <Row className="text_left">
                        <Col sm="2">
                            <h6>DEPARTAMENTO:</h6>
                        </Col>
                        <Col sm="auto">
                            <h6>{department.name !== undefined && department.name + ' - ' + department.acronym}</h6>
                        </Col>
                    </Row>
                </ListGroupItem>

                <ListGroupItem>
                    <Row className="text_left">
                        <Col sm="2">
                            <h6>RESPONSÁVEL:</h6>
                        </Col>
                        <Col sm="auto">
                            <h6>{department.boss !== undefined && department.boss.toUpperCase()}</h6>
                        </Col>
                    </Row>
                </ListGroupItem>

                <ListGroupItem>
                    <Row className="text_left">
                        <Col sm="auto" className="center">
                            <Button className="font_color_verde_zimbra_hover bg_color_transparent no_border text_undeline" onClick={toggleModalEditDepartment}>
                                Editar
                            </Button>
                        </Col>
                        <Col sm="auto" className="center">
                            <Button color="danger" onClick={toggleModalDeleteDepartment} value={department.id} name={department.name}>
                                Deletar
                            </Button>
                        </Col>
                    </Row>
                </ListGroupItem>
            </Container>
            {
                listHardwares.rows !== undefined &&
                    listHardwares.rows.length !== 0 ?
                    <>
                        <Container className="center margin_top_100">
                            <Row>
                                <Col>
                                    <Container>
                                        <Row>
                                            <Col sm="16">
                                                <h1 className="text-center">
                                                    Lista de equipamentos cadastrados ({listHardwares.count})
												</h1>
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
                                                    <option key={3} value={listHardwares.count}>Tudo</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>
                        </Container>

                        {
                            listHardwares.rows !== undefined &&
                            listHardwares.rows.length !== 0 &&
                            <PaginationComponent
                                pages={pages}
                                currentPage={currentPage}
                                handleCurrentPage={handleCurrentPage}
                                pageNeighbours={pageNeighbours}
                                pagesCount={pagesCount}
                            />
                        }

                        <Container className="margin_top_20 width_70" fluid={true}>
                            <ListGroupItem>
                                <Row>
                                    <Col className="border_only_right padding_all_10 center border_color_gray" sm="2">
                                        <strong>Tombamento</strong>
                                    </Col>
                                    <Col className="border_only_right padding_all_10 center border_color_gray" sm="4">
                                        <strong>Descrição</strong>
                                    </Col>
                                    <Col className="border_only_right padding_all_10 center border_color_gray" sm="2">
                                        <strong>Categoria</strong>
                                    </Col>
                                    <Col className="padding_all_10 center" sm="4">
                                        <strong>Ações</strong>
                                    </Col>
                                </Row>
                            </ListGroupItem>

                            {
                                listHardwares.rows !== undefined &&
                                listHardwares.rows.length !== 0 &&
                                listHardwares.rows.map(element => {
                                    return (
                                        <ListGroupItem className="margin_top_bottom_10" key={element.id}>
                                            <Row className="no_padding">
                                                <Col className="border_only_right padding_all_10 center_vertical border_color_gray" sm="2">
                                                    {element.code}
                                                </Col>
                                                <Col className="border_only_right padding_all_10 center_vertical border_color_gray" sm="4">
                                                    {element.description}
                                                </Col>
                                                <Col className="border_only_right padding_all_10 center_vertical border_color_gray" sm="2">
                                                    {element.category.name}
                                                </Col>
                                                <Col className="border_only_right padding_all_10 center border_color_gray" sm="2">
                                                    <Link className="font_color_verde_zimbra_hover" to={`/hardware/edit/${element.id}`}>Editar</Link>
                                                </Col>
                                                <Col className="padding_all_10 center" sm="2">
                                                    <Button onClick={toggleModalDeleteHardware} color="danger" value={element.id} name={element.code}>Deletar</Button>
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                    );
                                })
                            }
                        </Container>

                        {
                            listHardwares.rows !== undefined &&
                            listHardwares.rows.length !== 0 &&
                            <PaginationComponent
                                pages={pages}
                                currentPage={currentPage}
                                handleCurrentPage={handleCurrentPage}
                                pageNeighbours={pageNeighbours}
                                pagesCount={pagesCount}
                            />
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
                                departmentName !== '' ?
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
                                        <FormFeedback>O campo <strong>DEPARTAMENTO</strong> não pode ser vazio.</FormFeedback>
                                    </>
                                :
                                departmentName !== '' ?
                                    <>
                                        <Input
                                            value={departmentName}
                                            onChange={handleDepartmentName}
                                            invalid
                                        />
                                        <FormFeedback>Já existe um <strong>DEPARTAMENTO</strong> com o nome informado.</FormFeedback>
                                    </>
                                    :
                                    <>
                                        <Input
                                            value={departmentName}
                                            onChange={handleDepartmentName}
                                            invalid
                                        />
                                        <FormFeedback>O campo <strong>DEPARTAMENTO</strong> não pode ser vazio.</FormFeedback>
                                    </>
                        }
                    </FormGroup>

                    <FormGroup>
                        <Label>Sigla</Label>
                        {
                            validDepartmentAcronym ?
                                departmentAcronym !== '' ?
                                    <>
                                        <Input
                                            value={departmentAcronym}
                                            onChange={handleDepartmentAcronym}
                                            valid
                                        />
                                        <FormFeedback valid>Sigla válida</FormFeedback>
                                    </>
                                    :
                                    <>
                                        <Input
                                            value={departmentAcronym}
                                            onChange={handleDepartmentAcronym}
                                            invalid
                                        />
                                        <FormFeedback>O campo <strong>SIGLA</strong> não pode ser vazio.</FormFeedback>
                                    </>
                                :
                                departmentName !== '' ?
                                    <>
                                        <Input
                                            value={departmentAcronym}
                                            onChange={handleDepartmentAcronym}
                                            invalid
                                        />
                                        <FormFeedback>Já existe uma <strong>SIGLA</strong> com os caracteres informados.</FormFeedback>
                                    </>
                                    :
                                    <>
                                        <Input
                                            value={departmentAcronym}
                                            onChange={handleDepartmentAcronym}
                                            invalid
                                        />
                                        <FormFeedback>O campo <strong>SIGLA</strong> não pode ser vazio.</FormFeedback>
                                    </>
                        }
                    </FormGroup>

                    <FormGroup>
                        <Label>Responsável</Label>
                        {
                            validDepartmentBoss ?
                                <>
                                    <Input value={departmentBoss} onChange={handleDepartmentBoss} valid />
                                    <FormFeedback valid>Nome válido</FormFeedback>
                                </>
                                :
                                <>
                                    <Input value={departmentBoss} onChange={handleDepartmentBoss} invalid />
                                    <FormFeedback invalid>O campo <strong>RESPONSÁVEL</strong> não pode ser vazio.</FormFeedback>
                                </>
                        }

                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button className="bg_color_verde_zimbra" onClick={saveEditDepartment} disabled={verifyAllInputsValid() ? false : true}>
                        Salvar Alterações
					</Button>{' '}
                    <Button color="secondary" onClick={cancelEdition}>
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