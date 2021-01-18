import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Container,
    Row,
    Col,
    Button,
    ListGroup,
    ListGroupItem,
    FormFeedback,
    Alert
} from 'reactstrap';
import { BsPlusCircleFill } from 'react-icons/bs';

import api from '../../../services/api';
import AuthContext from '../../../contexts/auth';

export default function EditUser() {
    const use_id = useParams();

    const [user, setUser] = useState(Object);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [nameValid, setNameValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [visible, setVisible] = useState(false);
    const { message, setMessage, colorMessage } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        async function getUser() {
            const response = await api.get(`/users/${use_id.id}`);
            const data = await response.data.user;

            setName(data.name);
            setEmail(data.email.split('@')[0]);
            setListRoles(data.roles);

            setNameValid(true);
            setEmailValid(true);

            setUser(data);
        }
        getUser();
    }, [use_id.id]);

    useEffect(() => {
        async function getAllRoles() {
            const response = await api.get('/roles');
            const data = await response.data.roles;

            setRoles(data);
        }

        getAllRoles();
    }, []);

    useEffect(() => {
        function verifyMessage() {
            if (message[0] !== '') {
                setVisible(true);
            }
        }

        verifyMessage();
    }, [message]);

    const onDismiss = () => {
        setVisible(false);
    }

    async function updateUser() {
        if (verifyAllInputsValid()) {
            const id = user.id;

            const new_data = {
                id,
                name,
                email: email + '@sepog.fortaleza.ce.gov.br',
                roles: listRoles
            }

            const response = await api.put(`/users/${id}`, new_data);

            if (response.status === 200) {
                setMessage(['Informações atualizadas com sucesso.', response.status]);

                history.push('/users');
            }

            history.goBack();
        }
    };

    const emailValidator = (email) => {
        return (/(^[a-z0-9._-]+$)/gm.test(email));
    }
    const emptyFieldValidator = (data) => {
        return (/^\S.*/gm.test(data));
    }
    const handleName = (e) => {
        const verifyName = e.target.value;

        if (emptyFieldValidator(verifyName)) {
            setNameValid(true);
        }
        else {
            setNameValid(false)
        }

        setName(verifyName);
    }
    const handleEmail = (e) => {
        const verifyEmail = e.target.value;

        if (emailValidator(verifyEmail)) {
            setEmailValid(true);
        }
        else {
            setEmailValid(false)
        }

        setEmail(verifyEmail);
    }
    const addRole = (e) => {
        e.preventDefault();
        const idRole = parseInt(e.target.currentRole.value);

        if (idRole !== 0) {
            async function getRole(index) {
                const role = await api.get(`/roles/${index}`);

                const newListRoles = [...listRoles, role.data.role];

                setListRoles(newListRoles);
            }

            getRole(idRole);
        }
    }

    const removeRole = (e) => {
        e.preventDefault();
        const idRole = parseInt(e.target.value);

        if (idRole !== 0) {
            async function getRole(index) {

                const newListRoles = listRoles.filter((role) => {
                    return role.id !== parseInt(index)
                });

                setListRoles(newListRoles);
            }

            getRole(idRole);
        }
    }
    const verifyAllInputsValid = () => {
        if (
            emptyFieldValidator(name) &&
            emailValidator(email) &&
            listRoles.length !== 0
        ) {
            return true;
        }
        return false;
    }

    return (
        <>
            <Container className="width_30">
                <Alert color={colorMessage[message[1]]}
                    isOpen={visible}
                    toggle={onDismiss}>
                    {message[0]}
                </Alert>
            </Container>

            <Container className="height_content width_50" fluid={true}>
                <Row className="no_padding">
                    <Col>
                        <h3 className="text-center margin_top_bottom_20">Editar dados do {user.name}</h3>
                        {
                            user !== undefined &&
                            <>
                                <FormGroup>
                                    <Label className="margin_top_10" for="labelName">Nome</Label>
                                    {
                                        nameValid ?
                                            <>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    id="labelName"
                                                    placeholder="Nome"
                                                    value={name}
                                                    onChange={handleName}
                                                    className="margin_bottom_20"
                                                    valid
                                                />
                                                <FormFeedback valid>Nome válido</FormFeedback>
                                            </>
                                            :
                                            <>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    id="labelName"
                                                    placeholder="Nome"
                                                    value={name}
                                                    onChange={handleName}
                                                    className="margin_bottom_20"
                                                    invalid
                                                />
                                                <FormFeedback>O campo <strong>NOME</strong> não pode ser vazio.</FormFeedback>
                                            </>
                                    }
                                </FormGroup>

                                <FormGroup>
                                    <Container>
                                        <Row className="no_padding">
                                            <Col className="no_padding">
                                                <Label className="margin_top_10" for="labelEmail">Email</Label>
                                                {
                                                    emailValid ?
                                                        <>
                                                            <Input
                                                                type="text"
                                                                name="email"
                                                                id="labelEmail"
                                                                placeholder="Email"
                                                                defaultValue={email}
                                                                onChange={handleEmail}
                                                                className="margin_bottom_20"
                                                                valid
                                                            />
                                                            <FormFeedback valid>Email válido</FormFeedback>
                                                        </>
                                                        :
                                                        email !== '' ?
                                                            <>
                                                                <Input
                                                                    type="text"
                                                                    name="email"
                                                                    id="labelEmail"
                                                                    placeholder="Email"
                                                                    defaultValue={email}
                                                                    onChange={handleEmail}
                                                                    className="margin_bottom_20"
                                                                    invalid
                                                                />
                                                                <FormFeedback>O campo <strong>EMAIL</strong> contém caracteres inválidos.
                                                        Lista de caracteres que podem ser utilizados [., -, _]</FormFeedback>
                                                            </>
                                                            :
                                                            <>
                                                                <Input
                                                                    type="text"
                                                                    name="email"
                                                                    id="labelEmail"
                                                                    placeholder="Email"
                                                                    defaultValue={email}
                                                                    onChange={handleEmail}
                                                                    className="margin_bottom_20"
                                                                    invalid
                                                                />
                                                                <FormFeedback>O campo <strong>EMAIL</strong> não pode ser vazio.</FormFeedback>
                                                            </>
                                                }
                                            </Col>

                                            <Col>
                                                <Label className="margin_top_10" for="emailDomain">Domínio</Label>
                                                <Input
                                                    type="text"
                                                    name="emailDomain"
                                                    id="emailDomain"
                                                    defaultValue='@sepog.fortaleza.ce.gov.br'
                                                    className="margin_bottom_20"
                                                    disabled={true}
                                                />
                                            </Col>
                                        </Row>
                                    </Container>
                                </FormGroup>

                                <Form onSubmit={addRole}>
                                    <FormGroup>
                                        <Label className="margin_top_10" for="labelAddRole">Adicionar permissão</Label>

                                        <Row className="center_between">
                                            <Col sm="9">
                                                <Input type="select" name="currentRole" id="labelAddRole" className="margin_bottom_20">
                                                    <option key={0} value={0}>SELECIONAR UMA PERMISSÃO</option>
                                                    {roles !== undefined && roles.length !== 0 &&
                                                        roles.filter(({ id: id1 }) =>
                                                            !listRoles.some(({ id: id2 }) => (id1 === id2))
                                                        ).map(role => {
                                                            return <option key={role.id} value={role.id}>{role.name}</option>;
                                                        })
                                                    }
                                                </Input>
                                            </Col>

                                            <Col sm="auto">
                                                <Button className="bg_color_transparent font_color_verde_zimbra_hover no_border" title="Adicionar equipamento">
                                                    <BsPlusCircleFill size="30" />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </Form>

                                {listRoles !== undefined && listRoles.length !== 0 &&
                                    <>
                                        <Label className="margin_top_10" for="labelRoles">Lista de permissões</Label>

                                        <ListGroup>
                                            <div className="max_height_100">
                                                {
                                                    listRoles.map(role => {
                                                        return (
                                                            <ListGroupItem key={role.id}>
                                                                <Row>
                                                                    <Col className="center_vertical border_only_right">{role.name}</Col>
                                                                    <Col sm="auto" className="center">
                                                                        <Button value={role.id} onClick={removeRole}>Remover</Button>
                                                                    </Col>
                                                                </Row>
                                                            </ListGroupItem>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </ListGroup>
                                    </>
                                }

                                <Row>
                                    <Col className="center margin_top_bottom_20">
                                        <Button disabled={verifyAllInputsValid() ? false : true} className="margin_left_right_20 bg_color_verde_zimbra" onClick={updateUser}>Salvar</Button>
                                        <Button className="margin_left_right_20" onClick={() => { history.goBack() }}>Voltar</Button>
                                    </Col>
                                </Row>

                            </>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    );
}