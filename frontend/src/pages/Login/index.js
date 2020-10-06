import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useContext } from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';


import './index.css';

import AuthContext from '../../contexts/auth';

export default function Login() {
    const [useLogin, setUseLogin] = useState('');
    const [usePassword, setUsePassword] = useState('');

    const {signIn} = useContext(AuthContext);

    async function authenticate(e) {
        e.preventDefault();

        const login = e.target.email.value;
        const password = e.target.password.value;

        const user = {
            login,
            password
        }

        signIn(JSON.stringify(user));
    }

    function handleLogin(e) {
        setUseLogin(e.target.value);
    }
    function handlePassword(e) {
        setUsePassword(e.target.value);
    }

    return (
        <Container className="height_container center width_30">
            <Row className="border border_radius_20 padding_all_10_10_40_10 bg_color_white_zimbra">
                <Col>
                    <Row>
                        <Col>
                            <h2 className="text-center margin_top_bottom_20">Entre com suas credenciais</h2>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form onSubmit={authenticate}>
                                <FormGroup>
                                    <Label for="loginEmail">Email</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        id="loginEmail"
                                        placeholder="Email"
                                        value={useLogin}
                                        onChange={handleLogin}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="loginPassword">Senha</Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        id="loginPassword"
                                        placeholder="Senha"
                                        value={usePassword}
                                        onChange={handlePassword}
                                    />
                                </FormGroup>

                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" />{' '}
                                Lembrar-me
                            </Label>
                                </FormGroup>

                                <FormGroup className="center_vertical margin_top_20">
                                    <Button
                                        className="bg_color_verde_zimbra"
                                    >
                                        Acessar
                                    </Button>
                                    {/* <Link to="#" className="font_color_white_hover margin_left_20">Esqueceu a senha?</Link> */}
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}