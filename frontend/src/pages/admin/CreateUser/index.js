import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Container,
    Row,
    Col,
    Button,
    Alert,
    FormFeedback,
    ListGroup,
    ListGroupItem
} from 'reactstrap';

import { BsPlusCircleFill } from 'react-icons/bs';

import api from '../../../services/api';
import AuthContext from '../../../contexts/auth';

export default function CreateUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [roles, setRoles] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [nameValid, setNameValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
    const [visible, setVisible] = useState(false);
    const { message, setMessage, colorMessage } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        async function getRoles() {
            const response = await api.get('/roles');
            const data = await response.data.roles;

            if (data.length !== 0) {
                setRoles(data);
            }
        }

        getRoles();
    }, []);

    useEffect(() => {
        function verifyMessage() {
            if (message[0] !== '') {
                setVisible(true);
            }
        }

        verifyMessage();
    }, [message]);

    const emailValidator = (email) => {
        return (/(^[a-z0-9._-]+$)/gm.test(email));
    }

    const emptyFieldValidator = (data) => {
        return (/^\S.*/gm.test(data));
    }

    const sizePasswordValidator = (password) => {
        return (password.length >= 6);
    }

    const verifySpecialChar = (password) => {
        const validCharacters = ['.', '-', '!', '_', ',', '@', '#', '*', '$', '&'];

        for (let p in validCharacters) {
            if (password.includes(validCharacters[p])) return true;
        }
        return false;
    }

    // CLOSE MODAL
    const onDismiss = () => {
        setVisible(false);
    }

    // VERIFY IF ALL INPUTS ARE VALID
    // const verifyAllInputsValid = () => {
    // 	if (
    // 		emailValidator(email) &&
    // 		emptyFieldValidator(password) &&
    // 		emptyFieldValidator(confirmPassword) &&
    // 		emptyFieldValidator(roles) &&
    // 		auction === 'true' &&
    // 		date_auction !== null &&
    // 		emptyFieldValidator(date_auction) &&
    // 		name.length !== 0
    // 	) {
    // 		return true;
    // 	}
    // 	else if (
    // 		emailValidator(email) &&
    // 		emptyFieldValidator(password) &&
    // 		emptyFieldValidator(confirmPassword) &&
    // 		emptyFieldValidator(roles) &&
    // 		auction === 'false' &&
    // 		name.length !== 0
    // 	) {
    // 		return true;
    // 	}
    // 	return false;
    // }

    // MODIFY THE NAME FIELD VALUE
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

    // MODIFY THE EMAIL FIELD VALUE
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
    const handlePassword = (e) => {
        const verifyPassword = e.target.value;

        if (emptyFieldValidator(verifyPassword)) {
            setPasswordValid(true);
        }
        else {
            setPasswordValid(false);
        }

        setPassword(verifyPassword);
    }
    const handleConfirmPassword = (e) => {
        const verifyConfirmPassword = e.target.value;

        if (emptyFieldValidator(verifyConfirmPassword)) {
            setConfirmPasswordValid(true);
        }
        else {
            setConfirmPasswordValid(false);
        }

        setConfirmPassword(verifyConfirmPassword);
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

    return (
        <>
            <Container className="width_30">
                <Alert color={colorMessage[message[1]]}
                    isOpen={visible}
                    toggle={onDismiss}>
                    {message[0]}
                </Alert>
            </Container>

            <Container className="width_40" fluid={true}>
                <Row>
                    <Col>
                        <h2 className="margin_top_bottom_20 text-center">Cadastrar novo usuário</h2>
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
                                        <FormFeedback>
                                            O campo <strong>NOME</strong> não pode ser vazio.
											</FormFeedback>
                                    </>
                            }
                        </FormGroup>

                        <FormGroup>
                            <Container className="no_padding">
                                <Row className="no_padding">
                                    <Col>
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

                        <FormGroup>
                            <Label className="margin_top_10" for="labelPassword">Senha</Label>
                            {
                                passwordValid ?
                                    sizePasswordValidator(password) ?
                                        verifySpecialChar(password) ?
                                            password === confirmPassword ?
                                                <>
                                                    <Input
                                                        type="password"
                                                        name="password"
                                                        id="labelPassword"
                                                        placeholder="Senha"
                                                        defaultValue={password}
                                                        onChange={handlePassword}
                                                        className="margin_bottom_20"
                                                        valid
                                                    />
                                                    <FormFeedback valid>Senha válida</FormFeedback>
                                                </>
                                                :
                                                <>
                                                    <Input
                                                        type="password"
                                                        name="password"
                                                        id="labelPassword"
                                                        placeholder="Senha"
                                                        defaultValue={password}
                                                        onChange={handlePassword}
                                                        className="margin_bottom_20"
                                                        invalid
                                                    />
                                                    <FormFeedback>O campo <strong>SENHA</strong> não é igual ao campo <strong>CONFIRMAR SENHA</strong></FormFeedback>
                                                </>
                                            :
                                            <>
                                                <Input
                                                    type="password"
                                                    name="password"
                                                    id="labelPassword"
                                                    placeholder="Senha"
                                                    defaultValue={password}
                                                    onChange={handlePassword}
                                                    className="margin_bottom_20"
                                                    invalid
                                                />
                                                <FormFeedback>O campo <strong>SENHA</strong> tem que ter no mínimo 1 caractere especial. Ex.: ['.', '-', '!', '_', ',', '@', '#', '*', '$', '&']</FormFeedback>
                                            </>
                                        :
                                        <>
                                            <Input
                                                type="password"
                                                name="password"
                                                id="labelPassword"
                                                placeholder="Senha"
                                                defaultValue={password}
                                                onChange={handlePassword}
                                                className="margin_bottom_20"
                                                invalid
                                            />
                                            <FormFeedback>O campo <strong>SENHA</strong> tem que ter no mínimo 6 caracteres.</FormFeedback>
                                        </>
                                    :
                                    <>
                                        <Input
                                            type="password"
                                            name="password"
                                            id="labelPassword"
                                            placeholder="Senha"
                                            defaultValue={password}
                                            onChange={handlePassword}
                                            className="margin_bottom_20"
                                            invalid
                                        />
                                        <FormFeedback>O campo <strong>SENHA</strong> não pode ser vazio.</FormFeedback>
                                    </>
                            }
                        </FormGroup>

                        <FormGroup>
                            <Label className="margin_top_10" for="labelConfirmPassword">Confirmar senha</Label>
                            {
                                confirmPasswordValid ?
                                    sizePasswordValidator(confirmPassword) ?
                                        verifySpecialChar(confirmPassword) ?
                                            confirmPassword === password ?
                                                <>
                                                    <Input
                                                        type="password"
                                                        name="confirmPassword"
                                                        id="labelConfirmPassword"
                                                        placeholder="Confirmar senha"
                                                        defaultValue={confirmPassword}
                                                        onChange={handleConfirmPassword}
                                                        className="margin_bottom_20"
                                                        valid
                                                    />
                                                    <FormFeedback valid>Senha válida</FormFeedback>
                                                </>
                                                :
                                                <>
                                                    <Input
                                                        type="password"
                                                        name="password"
                                                        id="labelPassword"
                                                        placeholder="Senha"
                                                        defaultValue={confirmPassword}
                                                        onChange={handleConfirmPassword}
                                                        className="margin_bottom_20"
                                                        invalid
                                                    />
                                                    <FormFeedback>O campo <strong>CONFIRMAR SENHA</strong> não é igual ao campo <strong>SENHA</strong></FormFeedback>
                                                </>
                                            :
                                            <>
                                                <Input
                                                    type="password"
                                                    name="confirmPassword"
                                                    id="labelConfirmPassword"
                                                    placeholder="Confirmar senha"
                                                    defaultValue={confirmPassword}
                                                    onChange={handleConfirmPassword}
                                                    className="margin_bottom_20"
                                                    invalid
                                                />
                                                <FormFeedback>O campo <strong>SENHA</strong> tem que ter no mínimo 1 caractere especial. Ex.: ['.', '-', '!', '_', ',', '@', '#', '*', '$', '&']</FormFeedback>
                                            </>
                                        :
                                        <>
                                            <Input
                                                type="password"
                                                name="confirmPassword"
                                                id="labelConfirmPassword"
                                                placeholder="Confirmar senha"
                                                defaultValue={confirmPassword}
                                                onChange={handleConfirmPassword}
                                                className="margin_bottom_20"
                                                invalid
                                            />
                                            <FormFeedback>O campo <strong>SENHA</strong> tem que ter no mínimo 6 caracteres.</FormFeedback>
                                        </>
                                    :
                                    <>
                                        <Input
                                            type="password"
                                            name="confirmPassword"
                                            id="labelConfirmPassword"
                                            placeholder="Confirmar senha"
                                            defaultValue={confirmPassword}
                                            onChange={handleConfirmPassword}
                                            className="margin_bottom_20"
                                            invalid
                                        />
                                        <FormFeedback>O campo <strong>CONFIRMAR SENHA</strong> não pode ser vazio.</FormFeedback>
                                    </>
                            }
                        </FormGroup>

                        <Form onSubmit={addRole}>
                            <FormGroup>
                                <Label className="margin_top_10" for="labelAddRole">
                                    Adicionar permissão
                                </Label>

                                <Row className="center_between">
                                    <Col sm="9">
                                        <Input
                                            type="select"
                                            name="currentRole"
                                            id="labelAddRole"
                                            className="margin_bottom_20"
                                        >
                                            <option key={0} value={0}>SELECIONAR UMA PERMISSÃO</option>
                                            {roles !== undefined && roles.length !== 0 ?
                                                roles.filter(({ id: id1 }) =>
                                                    !listRoles.some(({ id: id2 }) => (id1 === id2))
                                                ).map(role => {
                                                    return (
                                                        <option key={role.id} value={role.id}>
                                                            {role.name}
                                                        </option>
                                                    );
                                                })
                                                : ''
                                            }
                                        </Input>
                                    </Col>

                                    <Col sm="auto">
                                        <Button
                                            className="bg_color_transparent font_color_verde_zimbra_hover no_border"
                                            title="Adicionar equipamento"
                                        ><BsPlusCircleFill size="30" /></Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>

                        {listRoles !== undefined && listRoles.length !== 0 ?
                            <>
                                <Label
                                    className="margin_top_10"
                                    for="labelDepartment">
                                    Lista de permissões
								</Label>

                                <ListGroup>
                                    <div className="max_height_100">
                                        {listRoles.map(role => {
                                            return (
                                                <ListGroupItem key={role.id}>
                                                    <Row>
                                                        <Col
                                                            sm="10"
                                                            className="center_vertical border_only_right">
                                                            {role.name}
                                                        </Col>
                                                        <Col
                                                            sm="auto"
                                                            className="center">
                                                            <Button
                                                                value={role.id}
                                                                onClick={removeRole}>
                                                                Remover
															</Button>
                                                        </Col>
                                                    </Row>
                                                </ListGroupItem>
                                            )
                                        })
                                        }
                                    </div>
                                </ListGroup>
                            </>
                            : ''
                        }

                        <FormGroup>
                            <Row>
                                <Col className="center margin_top_bottom_20">
                                    <Button
                                        className="
												margin_left_right_20
												bg_color_verde_zimbra
											"
                                    // onClick={validateCreation}
                                    // disabled={
                                    // verifyAllInputsValid() ? false : true
                                    // }
                                    >Cadastrar</Button>
                                    <Button
                                        className="margin_left_right_20"
                                        onClick={() => { history.goBack() }}
                                    >Voltar</Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                </Row>
            </Container>
        </>
    );
}