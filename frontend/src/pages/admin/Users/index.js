import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Row,
    Col,
    ListGroupItem,
    Button,
    Alert
} from 'reactstrap';

import { Link } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';

import api from '../../../services/api';
import AuthContext from '../../../contexts/auth';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [visible, setVisible] = useState(false);
    const { message, setMessage, colorMessage } = useContext(AuthContext);

    useEffect(() => {
        async function getUsers() {
            const response = await api.get(`/users/`);
            const data = await response.data.users;

            setUsers(data);
        }

        getUsers();
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
        setMessage(['', -1]);
    }

    return (
        <div className={users !== undefined && users.length >= 2 ? '' : 'height_content'}>
            <Container className="width_30">
                <Alert
                    color={colorMessage[message[1]]}
                    isOpen={visible}
                    toggle={onDismiss}>
                    {message[0]}
                </Alert>
            </Container>

            <Container fluid={true} className="margin_bottom_30 padding_all_10">
                <Row sm="auto" className="no_margin">
                    <Col sm="auto">
                        <Link
                            to="/user/create"
                            title="Cadastrar novo usuário"
                            className="font_color_verde_zimbra_hover">
                            <BsPlusCircleFill size="40" />
                        </Link>
                    </Col>
                </Row>
            </Container>

            {users !== undefined && users.length !== 0 ?
                <Container className="center margin_top_30">
                    <Row>
                        <Col>
                            <Container>
                                <Row>
                                    <Col sm="16">
                                        <h1 className="text-center">Usuários cadastrados</h1>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
                : ''
            }

            {users !== undefined && users.length !== 0 ?
                <Container fluid={true} className="margin_top_20 width_60 padding_all_10">
                    <ListGroupItem>
                        <Row>
                            <Col sm="2" className="border_only_right padding_all_10 center border_color_gray">
                                <strong>Nome</strong>
                            </Col>
                            <Col sm="4" className="border_only_right padding_all_10 center border_color_gray">
                                <strong>Email</strong>
                            </Col>
                            <Col sm="2" className="border_only_right padding_all_10 center border_color_gray">
                                <strong>Permissões</strong>
                            </Col>
                            <Col sm="4" className="padding_all_10 center">
                                <strong>Ações</strong>
                            </Col>
                        </Row>
                    </ListGroupItem>
                </Container>
                : ''
            }

            <Container className="width_60 padding_all_10" fluid={true}>
                {
                    users !== undefined && users.length !== 0 ?
                        users.map(user => {
                            return (
                                <ListGroupItem key={user.id}>
                                    <Row>
                                        <Col sm="2" className="padding_all_10 center_vertical border_only_right border_color_gray">
                                            <span>{user.name}</span>
                                        </Col>
                                        <Col sm="4" className="padding_all_10 center_vertical border_only_right border_color_gray">
                                            <span>{user.email}</span>
                                        </Col>
                                        <Col sm="2" className="padding_all_10 center_vertical border_only_right border_color_gray">
                                            <span>{
                                                user.roles.map((role, index) => {
                                                    return (
                                                    index === (user.roles.length - 1) ?
                                                        role.name
                                                    :   role.name + ", "
                                                    );
                                                })
                                            }</span>
                                        </Col>
                                        <Col sm="2" className="padding_all_10 border_only_right center border_color_gray">
                                            <Link to={`/user/edit/${user.id}`} className="font_color_verde_zimbra_hover">
                                                Editar
                                            </Link>
                                        </Col>
                                        <Col sm="2" className="center">
                                            <Button
                                                // onClick={toggle}
                                                color="danger"
                                                value={user.id}
                                            // name={user.heritage}
                                            >
                                                Deletar
                                                </Button>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            )
                        }) : ''
                }
            </Container>
        </div>
    );
}