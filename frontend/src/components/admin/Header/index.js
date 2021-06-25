import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import {
    Navbar,
    Nav,
    NavItem,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
    NavbarText,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    FormFeedback,
    Label,
    Button,
    Container,
    Row,
    Col
} from 'reactstrap';

import api from '../../../services/api';
import AuthContext from '../../../contexts/auth';

export default function AdminHeader() {
    const [listCategories, setCategories] = useState([]);
    const [listDepartments, setDepartments] = useState([]);
    const [listPublicAgencies, setPublicAgencies] = useState([]);
    const [dropdownDepartments, setDropdownDepartments] = useState(false);
    const [dropdownPublicAgencies, setDropdownPublicAgencies] = useState(false);
    const [dropdownCategories, setDropdownCategories] = useState(false);
    const [modalCreateDepartment, setModalCreateDepartment] = useState(false);
    const [modalCreatePublicAgencies, setModalCreatePublicAgencies] = useState(false);
    const [modalCreateCategory, setModalCreateCategory] = useState(false);
    const [departmentName, setDepartmentName] = useState('');
    const [departmentAcronym, setDepartmentAcronym] = useState('');
    const [publicAgencyName, setPublicAgencyName] = useState('');
    const [publicAgencyAcronym, setPublicAgencyAcronym] = useState('');
    const [departmentBoss, setDepartmentBoss] = useState('');
    const [verifyDepartmentName, setVerifyDepartmentName] = useState(false);
    const [verifyDepartmentAcronym, setVerifyDepartmentAcronym] = useState(false);
    const [verifyDepartmentBoss, setVerifyDepartmentBoss] = useState(false);
    const [verifyPublicAgencyName, setVerifyPublicAgencyName] = useState(false);
    const [verifyPublicAgencyAcronym, setVerifyPublicAgencyAcronym] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [verifyCategoryName, setVerifyCategoryName] = useState(true);
    const { user, message, setMessage, currentRoleUser, setCurrentRoleUser } = useContext(AuthContext);

    useEffect(() => {
        async function getAllCategories() {
            const response = await api.get('/category');
            const data = response.data.categories;
            setCategories(data);

            setCategoryName('');
            setVerifyCategoryName(false);
        }

        getAllCategories();
    }, [message]);

    useEffect(() => {
        async function getAllDepartments() {
            const response = await api.get('/departments');
            const data = response.data.departments;
            setDepartments(data);

            setDepartmentName('');
            setDepartmentAcronym('');
            setDepartmentBoss('');
            setVerifyDepartmentName(false);
            setVerifyDepartmentAcronym(false);
            setVerifyDepartmentBoss(false);
        }

        getAllDepartments();
    }, [message]);

    useEffect(() => {
        async function getAllPublicAgencies() {
            const response = await api.get('/public_agencies');
            const data = response.data.public_agencies;
            setPublicAgencies(data);

            setPublicAgencyName('');
            setPublicAgencyAcronym('');
            setVerifyPublicAgencyName(false);
            setVerifyPublicAgencyAcronym(false);
        }

        getAllPublicAgencies();
    }, [message]);

    useEffect(() => {
        async function getDepartment() {
            if (departmentName !== '') {
                const response = await api.get(`/departments/verify_name/${departmentName}`);
                const data = response.data;

                setVerifyDepartmentName(data.name_exists);
            }
        }

        getDepartment();
    }, [departmentName]);

    useEffect(() => {
        async function getDepartment() {
            if (departmentAcronym !== '') {
                let department = departmentAcronym.toUpperCase().replace("/", "-")
                const response = await api.get(`/departments/verify_acronym/${department}`);
                const data = response.data;

                setVerifyDepartmentAcronym(data.acronym_exists);
            }
        }

        getDepartment();
    }, [departmentAcronym]);

    useEffect(() => {
        async function getPublicAgency() {
            if (publicAgencyName !== '') {
                const response = await api.get(`/public_agencies/verify_name/${publicAgencyName}`);
                const data = response.data;

                setVerifyPublicAgencyName(data.acronym_exists);
            }
        }

        getPublicAgency();
    }, [publicAgencyName]);

    useEffect(() => {
        async function getPublicAgency() {
            if (publicAgencyAcronym !== '') {
                const response = await api.get(`/public_agencies/verify_acronym/${publicAgencyAcronym}`);
                const data = response.data;

                setVerifyPublicAgencyAcronym(data.acronym_exists);
            }
        }

        getPublicAgency();
    }, [publicAgencyAcronym]);

    useEffect(() => {
        async function getCategory() {
            if (categoryName !== '') {
                const response = await api.get(`/category/verify/${categoryName}`);
                const data = response.data;

                setVerifyCategoryName(data.nameExists);
            }
        }

        getCategory();
    }, [categoryName]);

    const toggleDepartments = () => {
        setDropdownDepartments(!dropdownDepartments)
    };
    const togglePublicAgencies = () => {
        setDropdownPublicAgencies(!dropdownPublicAgencies)
    };
    const toggleCategories = () => {
        setDropdownCategories(!dropdownCategories)
    };

    const toggleModalCreateDepartment = () => {
        setModalCreateDepartment(!modalCreateDepartment);
    }
    const toggleModalCreatePublicAgencies = () => {
        setModalCreatePublicAgencies(!modalCreatePublicAgencies);
    }
    const toggleModalCreateCategory = () => {
        setModalCreateCategory(!modalCreateCategory);
    }

    const handleCategoryName = (e) => {
        if (e.target.value === '') {
            setVerifyCategoryName(false);
        }

        setCategoryName(e.target.value);
    }

    const handleDepartmentName = (e) => {
        if (e.target.value === '') {
            setVerifyDepartmentName(false);
        }

        setDepartmentName(e.target.value);
    }

    const handleDepartmentAcronym = (e) => {
        if (e.target.value === '') {
            setVerifyDepartmentAcronym(false);
        }

        setDepartmentAcronym(e.target.value);
    }

    const handlePublicAgencyName = (e) => {
        if (e.target.value === '') {
            setVerifyPublicAgencyName(false);
        }

        setPublicAgencyName(e.target.value);
    }

    const handlePublicAgencyAcronym = (e) => {
        if (e.target.value === '') {
            setVerifyPublicAgencyAcronym(false);
        }

        setPublicAgencyAcronym(e.target.value);
    }

    const handleDepartmentBoss = (e) => {
        const validDepartmentBoss = e.target.value;

        if (/^\S.*/gm.exec(validDepartmentBoss)) {
            setVerifyDepartmentBoss(true);
        }
        else {
            setVerifyDepartmentBoss(false);
        }

        setDepartmentBoss(e.target.value);
    }

    const cancelCreationDepartment = () => {
        setDepartmentName('');
        setDepartmentAcronym('');
        setDepartmentBoss('');
        setVerifyDepartmentName(false);
        setVerifyDepartmentAcronym(false);
        setVerifyDepartmentBoss(false);
        toggleModalCreateDepartment();
    }

    const cancelCreationPublicAgency = () => {
        setPublicAgencyName('');
        setPublicAgencyAcronym('');
        setVerifyPublicAgencyName(false);
        setVerifyPublicAgencyAcronym(false);
        toggleModalCreatePublicAgencies();
    }

    const validCreateDepartment = () => {
        if (!verifyDepartmentName && departmentName !== '' && verifyDepartmentBoss && !verifyDepartmentAcronym && departmentAcronym !== '') {
            return true;
        }
        return false;
    }

    const validCreatePublicAgency = () => {
        if (!verifyPublicAgencyName && publicAgencyName !== '' && !verifyPublicAgencyAcronym && publicAgencyAcronym !== '') {
            return true;
        }
        return false;
    }

    const createDepartment = async () => {
        if (validCreateDepartment()) {
            const new_data = {
                name: departmentName,
                acronym: departmentAcronym,
                boss: departmentBoss
            }

            const response = await api.post(`departments/`, new_data);

            if (response.data.status === 200) {
                setMessage(['Departamento criado com sucesso', 200]);
                toggleModalCreateDepartment();
            }
            else {
                setMessage([response.error, response.status]);
                toggleModalCreateDepartment();
            }
        }
        else {
            setMessage(["Existem campos não preenchidos corretamente", 400]);
            toggleModalCreateDepartment();
        }
    }

    const createPublicAgency = async () => {
        if (validCreatePublicAgency()) {
            const new_data = {
                name: publicAgencyName.toUpperCase(),
                acronym: publicAgencyAcronym.toUpperCase()
            }

            const response = await api.post(`public_agencies/`, new_data);

            if (response.data.status === 200) {
                setMessage(['Órgão cadastrado com sucesso', 200]);
                toggleModalCreatePublicAgencies();
            }
            else {
                setMessage([response.error, response.status]);
                toggleModalCreatePublicAgencies();
            }
        }
        else {
            setMessage(["Existem campos não preenchidos corretamente", 400]);
            toggleModalCreatePublicAgencies();
        }
    }

    const cancelCreationCategory = () => {
        setCategoryName('');
        setVerifyCategoryName(false);
        toggleModalCreateCategory();
    }

    const validCreateCategory = () => {
        if (!verifyCategoryName && categoryName !== '') {
            return true;
        }
        return false;
    }

    const createCategory = async () => {
        if (validCreateCategory()) {
            const new_data = {
                name: categoryName
            }

            const response = await api.post(`categories/`, new_data);

            if (response.data.status === 201) {
                setMessage(['Categoria criada com sucesso', 201]);
                toggleModalCreateCategory();
            }
            else {
                setMessage([response.error, response.status]);
                toggleModalCreateCategory();
            }
        }
        else {
            setMessage(["Existem campos não preenchidos corretamente", 400]);
            toggleModalCreateCategory();
        }
    }

    const handlecurrentRoleUser = (e) => {
        setCurrentRoleUser(e.target.value);

        localStorage.getItem('@currentRole:user') ?
            localStorage.setItem('@currentRole:user', JSON.stringify(e.target.value)) :
            sessionStorage.setItem('@currentRole:user', JSON.stringify(e.target.value))
    }

    return (
        <div className="height_header">
            <Navbar className="bg_color_verde_zimbra_no_effect no_padding height_header">
                <Nav className='font_color_white'>
                    <NavItem className="bg_color_verde_escuro_zimbra padding_all_20 border_only_right height_header">
                        <Link className="font_size_title font_color_white height_header" to="/">
                            Sistema
						</Link>
                    </NavItem>

                    <NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header">
                        <Link className="center padding_all_20 font_color_white_hover height_header" to="/hardware">
                            Equipamentos
						</Link>
                    </NavItem>

                    <NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header">
                        <Link className="center padding_all_20 font_color_white_hover height_header" to="/movements">
                            Movimentações
						</Link>
                    </NavItem>

                    <Dropdown className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header" nav isOpen={dropdownDepartments} toggle={toggleDepartments}>
                        <DropdownToggle className="center padding_all_20 font_color_white_hover height_header" nav caret>
                            Departamentos
          				</DropdownToggle>

                        <DropdownMenu className="bg_color_verde_zimbra no_padding max_height_500">
                            <DropdownItem
                                className="bg_color_verde_zimbra_hover no_padding">
                                <Link
                                    className="center_vertical font_color_white_hover" to="#" onClick={toggleModalCreateDepartment}>
                                    <NavItem className="padding_all_10">
                                        CADASTRAR DEPARTAMENTO
                                    </NavItem>
                                </Link>
                            </DropdownItem>

                            <DropdownItem divider className="no_margin" />
                            {
                                listDepartments !== undefined &&
                                listDepartments.map(element => {
                                    return (
                                        <DropdownItem className="bg_color_verde_zimbra_hover no_padding" key={element.id}>
                                            <Link className="center_vertical font_color_white_hover" to={`/department/${element.acronym.replace("/", "-")}`}>
                                                <NavItem className="padding_all_10">
                                                    {element.acronym}
                                                </NavItem>
                                            </Link>
                                        </DropdownItem>
                                    )
                                })
                            }
                        </DropdownMenu>
                    </Dropdown>

                    <Dropdown className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header" nav isOpen={dropdownPublicAgencies} toggle={togglePublicAgencies}>
                        <DropdownToggle className="center padding_all_20 font_color_white_hover height_header" nav caret>
                            Órgãos Públicos
          				</DropdownToggle>

                        <DropdownMenu className="bg_color_verde_zimbra no_padding max_height_500">
                            <DropdownItem
                                className="bg_color_verde_zimbra_hover no_padding">
                                <Link
                                    className="center_vertical font_color_white_hover" to="#" onClick={toggleModalCreatePublicAgencies}>
                                    <NavItem className="padding_all_10">
                                        CADASTRAR ÓRGÃO
                                    </NavItem>
                                </Link>
                            </DropdownItem>

                            <DropdownItem divider className="no_margin" />
                            {
                                listPublicAgencies !== undefined &&
                                listPublicAgencies.map(element => {
                                    return (
                                        <DropdownItem className="bg_color_verde_zimbra_hover no_padding" key={element.id}>
                                            <Link className="center_vertical font_color_white_hover" to={`/public_agency/${element.acronym.replace("/", "-")}`}>
                                                <NavItem className="padding_all_10">
                                                    {element.acronym}
                                                </NavItem>
                                            </Link>
                                        </DropdownItem>
                                    )
                                })
                            }
                        </DropdownMenu>
                    </Dropdown>

                    <Dropdown className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header" nav isOpen={dropdownCategories} toggle={toggleCategories}>
                        <DropdownToggle className="center padding_all_20 font_color_white_hover height_header" nav caret>
                            Tipos
          				</DropdownToggle>

                        <DropdownMenu className="bg_color_verde_zimbra no_padding">
                            <DropdownItem className="bg_color_verde_zimbra_hover no_padding">
                                <Link className="center_vertical font_color_white_hover" to="#" onClick={toggleModalCreateCategory}>
                                    <NavItem className="padding_all_10">
                                        CADASTRAR CATEGORIA
                                    </NavItem>
                                </Link>
                            </DropdownItem>

                            <DropdownItem divider className="no_margin" />

                            {
                                listCategories !== undefined &&
                                listCategories.map(element => {
                                    return (
                                        <DropdownItem className="bg_color_verde_zimbra_hover no_padding" key={element.id}>
                                            <Link className="center_vertical font_color_white_hover" to={`/hardware/${element.name}`}>
                                                <NavItem className="padding_all_10">
                                                    {element.name}
                                                </NavItem>
                                            </Link>
                                        </DropdownItem>)
                                })
                            }

                        </DropdownMenu>
                    </Dropdown>
                    <NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header">
                        <Link className="center padding_all_20 font_color_white_hover center height_header" to={'/users'}>
                            Usuários
                        </Link>
                    </NavItem>

                    <NavItem className="center bg_color_verde_zimbra_hover margin_left_right_1 height_header">
                        <Link className="center padding_all_20 font_color_white_hover center height_header" to="/logout">
                            Sair
                        </Link>
                    </NavItem>
                </Nav>

                <NavbarText className="text-right padding_all_20 center height_header">
                    <Container className="center">
                        <Row>
                            <Col className="center">
                                <strong>{user.name}</strong>
                            </Col>

                            <Col sm="auto" className="center no_padding">
                                <FormGroup className="no_margin">
                                    <Input type="select" name="select" id="rolesUser" value={currentRoleUser} onChange={handlecurrentRoleUser}>
                                        {
                                            user.roles.map(element => {
                                                return (<option key={element.id}>{element.name}</option>);
                                            })
                                        }
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Container>
                </NavbarText>
            </Navbar>

            <Modal isOpen={modalCreateDepartment} toggle={toggleModalCreateDepartment}>
                <ModalHeader toggle={toggleModalCreateDepartment}>
                    Cadastrar departamento
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Label>Departamento</Label>
                        {
                            !verifyDepartmentName ?
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
                                <>
                                    <Input
                                        value={departmentName}
                                        onChange={handleDepartmentName}
                                        invalid
                                    />
                                    <FormFeedback>Já existe um <strong>DEPARTAMENTO</strong> com o nome informado.</FormFeedback>
                                </>
                        }
                    </FormGroup>

                    <FormGroup>
                        <Label>Sigla</Label>
                        {
                            !verifyDepartmentAcronym ?
                                departmentAcronym !== '' ?
                                    <>
                                        <Input value={departmentAcronym} onChange={handleDepartmentAcronym} valid />
                                        <FormFeedback valid>Sigla válida</FormFeedback>
                                    </>
                                    :
                                    <>
                                        <Input value={departmentAcronym} onChange={handleDepartmentAcronym} invalid />
                                        <FormFeedback>O campo <strong>SIGLA</strong> não pode ser vazio.</FormFeedback>
                                    </>
                                :
                                <>
                                    <Input value={departmentAcronym} onChange={handleDepartmentAcronym} invalid />
                                    <FormFeedback>Já existe uma <strong>SIGLA</strong> com os caracteres informados.</FormFeedback>
                                </>
                        }
                    </FormGroup>

                    <FormGroup>
                        <Label>Responsável</Label>
                        {
                            verifyDepartmentBoss ?
                                <>
                                    <Input value={departmentBoss} onChange={handleDepartmentBoss} valid />
                                    <FormFeedback valid>Nome válido</FormFeedback>
                                </>
                                :
                                <>
                                    <Input value={departmentBoss} onChange={handleDepartmentBoss} invalid />
                                    <FormFeedback>O campo <strong>RESPONSÁVEL</strong> não pode ser vazio.</FormFeedback>
                                </>
                        }
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button className="bg_color_verde_zimbra" onClick={createDepartment} disabled={!validCreateDepartment() ? true : false}>
                        Criar
					</Button>{' '}
                    <Button color="secondary" onClick={cancelCreationDepartment}>
                        Cancelar
					</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalCreatePublicAgencies} toggle={toggleModalCreatePublicAgencies}>
                <ModalHeader toggle={toggleModalCreatePublicAgencies}>
                    Cadastrar órgão
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Label>Órgão</Label>
                        {
                            !verifyPublicAgencyName ?
                                publicAgencyName !== '' ?
                                    <>
                                        <Input value={publicAgencyName} onChange={handlePublicAgencyName} valid />
                                        <FormFeedback valid>Nome válido</FormFeedback>
                                    </>
                                    :
                                    <>
                                        <Input value={publicAgencyName} onChange={handlePublicAgencyName} invalid />
                                        <FormFeedback>O campo <strong>ÓRGÃO</strong> não pode ser vazio.</FormFeedback>
                                    </>
                                :
                                <>
                                    <Input value={publicAgencyName} onChange={handlePublicAgencyName} invalid />
                                    <FormFeedback>Já existe um <strong>ÓRGÃO</strong> com o nome informado.</FormFeedback>
                                </>
                        }
                    </FormGroup>

                    <FormGroup>
                        <Label>Sigla</Label>
                        {
                            !verifyPublicAgencyAcronym ?
                                publicAgencyAcronym !== '' ?
                                    <>
                                        <Input value={publicAgencyAcronym} onChange={handlePublicAgencyAcronym} valid />
                                        <FormFeedback valid>Sigla válida</FormFeedback>
                                    </>
                                    :
                                    <>
                                        <Input value={publicAgencyAcronym} onChange={handlePublicAgencyAcronym} invalid />
                                        <FormFeedback>O campo <strong>SIGLA</strong> não pode ser vazio.</FormFeedback>
                                    </>
                                :
                                <>
                                    <Input value={publicAgencyAcronym} onChange={handlePublicAgencyAcronym} invalid />
                                    <FormFeedback>Já existe uma <strong>SIGLA</strong> com os caracteres informados.</FormFeedback>
                                </>
                        }
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button className="bg_color_verde_zimbra" onClick={createPublicAgency} disabled={!validCreatePublicAgency() ? true : false}>
                        Criar
					</Button>{' '}
                    <Button color="secondary" onClick={cancelCreationPublicAgency}>
                        Cancelar
					</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalCreateCategory} toggle={toggleModalCreateCategory}>
                <ModalHeader toggle={toggleModalCreateCategory}>
                    Criar Categoria
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Label>Categoria</Label>
                        {
                            !verifyCategoryName ?
                                categoryName !== '' ?
                                    <>
                                        <Input value={categoryName} onChange={handleCategoryName} valid />
                                        <FormFeedback valid>Nome de <strong>CATEGORIA</strong> válido</FormFeedback>
                                    </>
                                    :
                                    <>
                                        <Input value={categoryName} onChange={handleCategoryName} invalid />
                                        <FormFeedback>O campo <strong>CATEGORIA</strong> não pode ser vazio.</FormFeedback>
                                    </>
                                :
                                <>
                                    <Input value={categoryName} onChange={handleCategoryName} invalid />
                                    <FormFeedback>Já existe uma <strong>CATEGORIA</strong> com o nome informado.</FormFeedback>
                                </>
                        }
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button className="bg_color_verde_zimbra" onClick={createCategory} disabled={!validCreateCategory() ? true : false}>
                        Criar
					</Button>{' '}
                    <Button color="secondary" onClick={cancelCreationCategory}>
                        Cancelar
					</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}