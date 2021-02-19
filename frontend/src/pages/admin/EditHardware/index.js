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
    Alert
} from 'reactstrap';

import api from '../../../services/api';
import AuthContext from '../../../contexts/auth';

export default function EditHardware() {
    const hardware_id = useParams();

    const [hardware, setHardware] = useState(Object);
    const [types, setTypes] = useState([]);
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [warranty, setWarranty] = useState('');
    const [has_office, setHasOffice] = useState('SEM OFFICE');
    const [category, setCategory] = useState(1);
    const [visible, setVisible] = useState(false);

    const { message, setMessage, colorMessage } = useContext(AuthContext);

    const history = useHistory();

    useEffect(() => {
        async function getHardware() {
            const response = await api.get(`/hardwares/${hardware_id.id}`);
            const data = await response.data.hardware;

            setCode(data.code);
            setDescription(data.description);
            setBrand(data.brand);
            setWarranty(data.warranty);
            setHasOffice(data.has_office);
            setCategory(data.category.id);

            setHardware(data);
        }
        getHardware();
    }, [hardware_id.id]);

    useEffect(() => {
        async function getAllTypes() {
            const response = await api.get('/types');
            const data = await response.data.types;

            setTypes(data);
        }

        getAllTypes();
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

    async function updateHardware() {
        const type_id = category;
        const department_id = hardware.belongs.id;
        const id = hardware.id;

        const new_data = {
            id,
            code,
            description,
            brand,
            warranty,
            has_office,
            type_id,
            department_id
        }

        const response = await api.put(`/hardwares/${id}`, new_data);

        if (response.status === 200) {
            history.goBack();
            setMessage([`Informações do equipamento de tombamento: ${response.data.hardware.code} foram atualizadas com sucesso`, response.status])
        }

    };

    function handleCode(e) {
        setCode(e.target.value);
    }
    function handleDescription(e) {
        setDescription(e.target.value);
    }
    function handleBrand(e) {
        setBrand(e.target.value);
    }
    function handleWarranty(e) {
        setWarranty(e.target.value);
    }
    function handleHasOffice(e) {
        setHasOffice(e.target.value);
    }
    function handleCategory(e) {
        setCategory(e.target.value);
    }

    return (
        <>
            <Container className="width_30">
                <Alert color={colorMessage[message[1]]} isOpen={visible} toggle={onDismiss}>
                    {message[0]}
                </Alert>
            </Container>

            <Container className="center">
                <Row className="no_padding">
                    <Col>
                        <h3 className="text-center margin_top_bottom_20">Editar dados do equipamento {hardware.code}</h3>
                        <Form>
                            {
                                hardware !== undefined &&
                                <>
                                    <FormGroup key={hardware.id}>
                                        <Label className="margin_top_10" for="labelCode">Tombamento</Label>
                                        <Input
                                            type="text"
                                            name="code"
                                            id="labelCode"
                                            placeholder="Tombamento"
                                            value={code}
                                            onChange={handleCode}
                                            className="margin_bottom_20"
                                        />

                                        <Label className="margin_top_10" for="labelDescription">Descrição</Label>
                                        <Input
                                            type="text"
                                            name="description"
                                            id="labelDescription"
                                            placeholder="Descrição"
                                            defaultValue={description}
                                            onChange={handleDescription}
                                            className="margin_bottom_20"
                                        />

                                        <Label className="margin_top_10" for="labelBrand">Marca</Label>
                                        <Input
                                            type="text"
                                            name="brand"
                                            id="labelBrand"
                                            placeholder="Marca"
                                            defaultValue={brand}
                                            onChange={handleBrand}
                                            className="margin_bottom_20"
                                        />

                                        <Label className="margin_top_10" for="labelWarranty">Garantia</Label>
                                        <Input
                                            type="date"
                                            name="warranty"
                                            id="labelWarranty"
                                            placeholder="Garantia"
                                            defaultValue={warranty}
                                            onChange={handleWarranty}
                                            className="margin_bottom_20"
                                        />

                                        <Label className="margin_top_10" for="labelHasOffice">Tem office</Label>
                                        <Input
                                            type="select"
                                            name="has_office"
                                            id="labelHasOffice"
                                            placeholder="Tem office?"
                                            defaultValue={has_office}
                                            onChange={handleHasOffice}
                                            className="margin_bottom_20"
                                        >
                                            <option key={0} value={'SEM OFFICE'}>SEM OFFICE</option>
                                            <option key={1} value={'2007'}>2007</option>
                                            <option key={2} value={'2013'}>2013</option>
                                            <option key={3} value={'2016'}>2016</option>
                                        </Input>

                                        <Label className="margin_top_10" for="labelCategory">Tipo</Label>
                                        <Input
                                            type="select"
                                            name="category"
                                            id="labelCategory"
                                            value={category}
                                            onChange={handleCategory}
                                            className="margin_bottom_20"
                                        >
                                            {
                                                types !== undefined ?
                                                    types.map(element => {
                                                        return (
                                                            <option
                                                                key={element.id}
                                                                value={element.id}
                                                            >{element.name}</option>
                                                        );
                                                    }) : ''
                                            }
                                        </Input>

                                        <Row>
                                            <Col className="center margin_top_bottom_20">
                                                <Button
                                                    className="
													margin_left_right_20
													bg_color_verde_zimbra
												"
                                                    onClick={updateHardware}
                                                >Salvar</Button>
                                                <Button
                                                    className="margin_left_right_20"
                                                    onClick={() => { history.goBack() }}
                                                >Voltar</Button>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </>
                            }
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}