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
    ListGroup,
    ListGroupItem,
    Alert,
    FormFeedback,
} from 'reactstrap';
import { BsPlusCircleFill } from 'react-icons/bs';

import api from '../../../services/api';
import AuthContext from '../../../contexts/auth';

export default function CreateMovement() {
    const [typeMovement, setTypeMovement] = useState([]);
    const [hardwares, setHardwares] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [listHardwares, setListHardwares] = useState([]);
    const [date_movement, setDateMovement] = useState('');
    const [responsible, setReponsible] = useState(1);
    const [destination_department, setDestinationDepartment] = useState(1);
    const [origin_department, setOriginDepartment] = useState(1);
    const [dateMovementValid, setDateMovementValid] = useState(false);
    const [visible, setVisible] = useState(false);
    const history = useHistory();
    const { user, message, setMessage, colorMessage } = useContext(AuthContext);


    useEffect(() => {
        async function getAllHardwares() {
            const response = await api.get(`/hardwares/department/${origin_department}`);
            const data = await response.data.hardware;

            if (data) {
                setHardwares(data);
            }
        }

        getAllHardwares();
    }, [origin_department]);

    useEffect(() => {
        async function getAllTypeMovements() {
            const response = await api.get(`/type_movements`);
            const data = await response.data.typeMovements;

            setTypeMovement(data);
        }

        getAllTypeMovements();
    }, [origin_department]);

    useEffect(() => {
        setReponsible(user.name);
    }, [user.name]);

    useEffect(() => {
        async function getAllDepartments() {
            const response = await api.get('/departments');
            const data = await response.data;

            if (data.length < 2) {
                history.goBack();
            }
            else {
                setDestinationDepartment(data[0].id);
                setOriginDepartment(data[1].id);
                setDepartments(data);
                
                let date = new Date().toLocaleDateString().split("/");
                date = date[2] + "-" + date[1] + "-" + date[0];

                setDateMovement(date);
                setDateMovementValid(true);
            }
        }

        getAllDepartments();
    }, [history]);

    useEffect(() => {
        function verifyMessage() {
            if (message[0] !== '') {
                setVisible(true);
            }
        }

        verifyMessage();
    }, [message]);

    console.log(new Date().toLocaleDateString())

    // CLOSE MODAL
    const onDismiss = () => {
        setVisible(false);
    }

    const emptyFieldValidator = (data) => {
        return (/^\S.*/gm.test(data));
    }

    const addHardware = (e) => {
        e.preventDefault();

        if (parseInt(e.target.hardwares.value) !== 0) {
            async function getHardware(index) {
                const hardware = await api.get(`/hardwares/${index}`);

                const newListHardwares = [...listHardwares, hardware.data];

                setListHardwares(newListHardwares);
            }

            getHardware(e.target.hardwares.value);
        }
    }

    const removeHardware = (e) => {
        e.preventDefault();

        if (parseInt(e.target.value) !== 0) {
            async function getHardware(index) {

                const newListHardwares = listHardwares.filter((element) => {
                    return element.id !== parseInt(index)
                });

                setListHardwares(newListHardwares);
            }

            getHardware(e.target.value);
        }
    }

    const handleDateMovement = (e) => {
        const verifyDateMovement = e.target.value;

        if (emptyFieldValidator(verifyDateMovement)) {
            setDateMovementValid(true);
        }
        else {
            setDateMovementValid(false);
        }

        setDateMovement(verifyDateMovement);
    }

    const handleResponsible = (e) => {
        setReponsible(parseInt(e.target.value));
    }

    const handleDestinationDepartment = (e) => {
        setDestinationDepartment(parseInt(e.target.value));

    }
    const handleOriginDepartment = (e) => {
        setOriginDepartment(parseInt(e.target.value));

        const destinationDepartmentId = departments.filter(department => {
            return (
                department &&
                department.id !== parseInt(e.target.value)
            );
        });

        setDestinationDepartment(destinationDepartmentId[0].id);
    }

    // VERIFY IF ALL INPUTS ARE VALID
    const verifyAllInputsValid = () => {
        if (
            emptyFieldValidator(date_movement) &&
            listHardwares.length !== 0
        ) {
            return true;
        }
        return false;
    }

    const validateCreation = () => {
        const validation = verifyAllInputsValid();

        if (validation) {
            createMovement();
        }
        else {
            setMessage(["Existem campos não preenchidos corretamente", 400]);
        }
    }

    const createMovement = async () => {
        const id_hardwares = listHardwares.map(element => {
            return { "id": element.id }
        });

        const data = {
            date_movement,
            responsible_id: parseInt(user.id),
            destination_department_id: destination_department,
            origin_department_id: origin_department,
            hardwares: id_hardwares
        }

        await api.post('/movements', data);

        setMessage(['Movimentação criada com sucesso!', 200]);

        history.goBack();
    }

    return (
        <div>
            <Container className="width_30">
                <Alert color={colorMessage[message[1]]} isOpen={visible} toggle={onDismiss}>
                    {message[0]}
                </Alert>
            </Container>

            <h1 className="text-center"> Criar uma nova movimentação </h1>

            <Container className="width_40">
                <Row>
                    <Col>
                        <FormGroup>
                            <Label className="margin_top_10" for="labelTypeMovement">
                                Tipo de movimentação
						    </Label>

                            <Input
                                type="select"
                                name="type_movement_id"
                                id="labelTypeMovement"
                                value={typeMovement}
                                onChange={() => {}}
                                className="margin_bottom_20"
                                required>
                                {
                                    typeMovement !== undefined &&
                                    typeMovement.length !== 0 &&
                                    typeMovement.map(element => {
                                        return (
                                            <option key={element.id} value={element.id}>
                                                {element.description}
                                            </option>
                                        );
                                    })
                                }
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label className="margin_top_10" for="labelDate">
                                Data da movimentação
							</Label>

                            {
                                dateMovementValid ?
                                    <>
                                        <Input
                                            type="date"
                                            name="date_movement"
                                            id="labelDate"
                                            placeholder="Data"
                                            value={date_movement}
                                            onChange={handleDateMovement}
                                            className="margin_bottom_20"
                                            valid />
                                        <FormFeedback valid>Data de movimentação válida</FormFeedback>
                                    </>
                                    :
                                    <>
                                        <Input
                                            type="date"
                                            name="date_movement"
                                            id="labelDate"
                                            placeholder="Data"
                                            value={date_movement}
                                            onChange={handleDateMovement}
                                            className="margin_bottom_20"
                                            invalid />
                                        <FormFeedback>O campo <strong>DATA DA MOVIMENTAÇÃO</strong> não pode ser vazio.</FormFeedback>
                                    </>
                            }
                        </FormGroup>

                        <FormGroup>
                            <Label className="margin_top_10" for="labelResponsible">
                                Responsável
						    </Label>

                            <Input
                                type="text"
                                name="responsible_id"
                                id="labelResponsible"
                                placeholder="Responsável"
                                value={responsible}
                                onChange={handleResponsible}
                                className="margin_bottom_20"
                                readOnly />
                        </FormGroup>

                        <FormGroup>
                            <Label className="margin_top_10" for="labelPreviousDepartment">
                                Departamento original
						    </Label>

                            <Input
                                type="select"
                                name="origin_department_id"
                                id="labelPreviousDepartment"
                                value={origin_department}
                                onChange={handleOriginDepartment}
                                className="margin_bottom_20">
                                {
                                    departments !== undefined &&
                                    departments.length !== 0 &&
                                    departments.map(element => {
                                        return (
                                            <option key={element.id} value={element.id}>
                                                {element.name}
                                            </option>
                                        );
                                    })
                                }
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label className="margin_top_10" for="labelNextDepartment">
                                Departamento destino
						    </Label>

                            <Input
                                type="select"
                                name="destination_department_id"
                                id="labelNextDepartment"
                                value={destination_department}
                                onChange={handleDestinationDepartment}
                                className="margin_bottom_20"
                                required>
                                {
                                    departments !== undefined &&
                                    departments.length !== 0 &&
                                    departments.filter(department => {
                                        return (department && department.id !== origin_department);
                                    }).map(element => {
                                        return (
                                            <option key={element.id} value={element.id}>
                                                {element.name}
                                            </option>
                                        );
                                    })
                                }
                            </Input>
                        </FormGroup>

                        <Form onSubmit={addHardware}>
                            <FormGroup>
                                <Label
                                    className="margin_top_10"
                                    for="labelAddHardware"
                                >
                                    Adicionar equipamentos
								</Label>
                                <Row className="center_between">
                                    <Col sm="9">
                                        <Input type="select" name="hardwares" id="labelAddHardware" className="margin_bottom_20">
                                            <option key={0} value={0}>SELECIONAR EQUIPAMENTO</option>
                                            {
                                                hardwares !== undefined &&
                                                hardwares.length !== 0 &&
                                                hardwares.filter(({ id: id1 }) =>
                                                    !listHardwares.some(({ id: id2 }) => (id1 === id2))
                                                ).map(element => {
                                                    return (
                                                        <option key={element.id} value={element.id}>
                                                            {element.code.replace("-", "")} | {' '}
                                                            {element.description}
                                                        </option>
                                                    );
                                                })
                                            }
                                        </Input>
                                    </Col>

                                    <Col sm="auto">
                                        <Button
                                            className="
												bg_color_transparent
												font_color_verde_zimbra_hover
												no_border
											"
                                            title="Adicionar equipamento"
                                        ><BsPlusCircleFill size="30" /></Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>

                        {
                            listHardwares !== undefined &&
                                listHardwares.length !== 0 ?
                                <>
                                    <Label
                                        className="margin_top_10"
                                        for="labelDepartment"
                                    >
                                        Lista de equipamentos para movimentação
									</Label>
                                    <ListGroup>
                                        <div className="max_height_100">
                                            {
                                                listHardwares.map(hardware => {
                                                    return (
                                                        <ListGroupItem key={hardware.id}>
                                                            <Row>
                                                                <Col
                                                                    sm="auto"
                                                                    className="
																		center
																		border_only_right
																	"
                                                                >
                                                                    {hardware.code}
                                                                </Col>
                                                                <Col className="center_vertical">
                                                                    {hardware.description}
                                                                </Col>
                                                                <Col
                                                                    sm="auto"
                                                                    className="center"
                                                                >
                                                                    <Button
                                                                        value={hardware.id}
                                                                        onClick={removeHardware}
                                                                    >
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

                        <Row>
                            <Col className="center margin_top_bottom_20">
                                <Button
                                    className="
										margin_left_right_20
										bg_color_verde_zimbra
									"
                                    onClick={validateCreation}
                                    disabled={
                                        verifyAllInputsValid() ? false : true
                                    }
                                >
                                    Criar
								</Button>
                                <Button
                                    color="secondary"
                                    className="margin_left_right_20"
                                    onClick={() => { history.goBack() }}
                                >
                                    Voltar
								</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container >
        </div>
    );
}