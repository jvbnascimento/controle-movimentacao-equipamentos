import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
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
	ListGroupItem
} from 'reactstrap';
import { BsPlusCircleFill } from 'react-icons/bs';

import api from '../../services/api';

export default function CreateMovement() {
    const [hardwares, setHardwares] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [listHardwares, setListHardwares] = useState([]);

    const [date_movement, setDateMovement] = useState('');
    const [responsible, setReponsible] = useState(1);
    const [destination_department, setDestinationDepartment] = useState(1);
    const [origin_department, setOriginDepartment] = useState(1);

    const history = useHistory();

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        async function getAllHardwares() {
            const response = await api.get(`/hardwares/department/${origin_department}`);
            const data = await response.data;

            setHardwares(data);
        }

        getAllHardwares();
    }, [origin_department]);

    useEffect(() => {
        setReponsible(user.name);
    }, [user.name]);

    useEffect(() => {
        async function getAllDepartments() {
            const response = await api.get('/departments');
            const data = await response.data;

            setDestinationDepartment(data[0].id);
            setOriginDepartment(data[1].id);
            setDepartments(data);
        }

        getAllDepartments();
    }, []);

    function addHardware(e) {
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

    function removeHardware(e) {
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

    function handleDateMovement(e) {
        setDateMovement(e.target.value);
    }
    function handleResponsible(e) {
        setReponsible(parseInt(e.target.value));
    }
    function handleDestinationDepartment(e) {
        setDestinationDepartment(parseInt(e.target.value));
        
    }
    function handleOriginDepartment(e) {
        setOriginDepartment(parseInt(e.target.value));

        const destinationDepartmentId = departments.filter(department => {
            return department && department.id !== parseInt(e.target.value);
        });

        setDestinationDepartment(destinationDepartmentId[0].id);
    }

    async function createMovement() {
        const id_hardwares = listHardwares.map(element => { return { "id": element.id } });

        const data = {
            date_movement,
            responsible_id: parseInt(user.id),
            destination_department_id: destination_department,
            origin_department_id: origin_department,
            hardwares: id_hardwares
		}

        await api.post('/movements', data);

        history.goBack();
    }

    return (
        <div className="height_content">
            <h1 className="margin_top_bottom_20 text-center"> Criar uma nova movimentação </h1>

            <Container className="width_40">
                <Row>
                    <Col>
                        <Label className="margin_top_10" for="labelDate">Data da movimentação</Label>
                        <Input
                            type="date"
                            name="date_movement"
                            id="labelDate"
                            placeholder="Data"
                            value={date_movement}
                            onChange={handleDateMovement}
                            className="margin_bottom_20"
                        />

                        <Label className="margin_top_10" for="labelResponsible">Responsável</Label>
                        <Input
                            type="text"
                            name="responsible_id"
                            id="labelResponsible"
                            placeholder="Responsável"
                            value={responsible}
                            onChange={handleResponsible}
                            className="margin_bottom_20"
                            readOnly
                        />

                        <Label className="margin_top_10" for="labelNextDepartment">Departamento destino</Label>
                        <Input
                            type="select"
                            name="destination_department_id"
                            id="labelNextDepartment"
                            value={destination_department}
                            onChange={handleDestinationDepartment}
                            className="margin_bottom_20"
                            required
                        >
                            {
                                departments !== undefined && departments.length !== 0 ?
                                    departments.filter(department => {
                                        return department && department.id !== origin_department;
                                    }).map(element => {
                                        return (
                                            <option
                                                key={element.id}
                                                value={element.id}
                                            >{element.name} | {element.boss}</option>
                                        );
                                    }) : ''
                            }
                        </Input>

                        <Label className="margin_top_10" for="labelPreviousDepartment">Departamento original</Label>
                        <Input
                            type="select"
                            name="origin_department_id"
                            id="labelPreviousDepartment"
                            value={origin_department}
                            onChange={handleOriginDepartment}
                            className="margin_bottom_20"
                        >
                            {
                                departments !== undefined && departments.length !== 0 ?
                                    departments.map(element => {
                                        return (
                                            <option
                                                key={element.id}
                                                value={element.id}
                                            >{element.name} | {element.boss}</option>
                                        );
                                    })
                                    : ''
                            }
                        </Input>

                        <Form onSubmit={addHardware}>
                            <FormGroup>
                                <Label className="margin_top_10" for="labelAddHardware">Adicionar equipamentos</Label>
                                <Row className="center_between">
                                    <Col sm="9">
                                        <Input
                                            type="select"
                                            name="hardwares"
                                            id="labelAddHardware"
                                            className="margin_bottom_20"
                                        >
                                            <option
                                                key={0}
                                                value={0}
                                            >SELECIONAR EQUIPAMENTO</option>
                                            {
                                                hardwares !== undefined && hardwares.length !== 0 ?
                                                    hardwares.filter(
														({ id: id1 }) => 
														!listHardwares.some(
															({ id: id2 }) => (id1 === id2)
														)
													).map(element => {
                                                        return (
                                                            <option
                                                                key={element.id}
                                                                value={element.id}
                                                            >{element.heritage.replace("-", "")} | {element.description}</option>
                                                        );
                                                    })
                                                    : ''
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
                            listHardwares !== undefined && listHardwares.length !== 0 ?
                                <>
                                    <Label className="margin_top_10" for="labelDepartment">Lista de equipamentos para movimentação</Label>
                                    <ListGroup>
                                        <div className="max_height">
                                            {
                                                listHardwares.map(hardware => {
                                                    return (
                                                        <ListGroupItem key={hardware.id}>
                                                            <Row>
                                                                <Col sm="auto" className="center border_only_right">{hardware.heritage}</Col>
                                                                <Col>{hardware.description}</Col>
                                                                <Col sm="auto" className="center">
                                                                    <Button
                                                                        value={hardware.id}
                                                                        onClick={removeHardware}>Remover</Button>
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
                                    onClick={createMovement}
                                >Criar</Button>
								<Button
									color="secondary"
									className="margin_left_right_20"
									onClick={() => { history.goBack() }}
								>Voltar</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container >
        </div>
    );
}