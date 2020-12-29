import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Container, Row, Col, Button } from 'reactstrap';

import api from '../../../services/api';

export default function EditHardware() {
    const hardware_id = useParams();

    const [hardware, setHardware] = useState(Object);
    const [types, setTypes] = useState([]);
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [warranty, setWarranty] = useState('');
    const [has_office, setHasOffice] = useState('SEM OFFICE');
    const [auction, setAuction] = useState('true');
    const [date_auction, setDateAuction] = useState(null);
    const [category, setCategory] = useState(1);

    const history = useHistory();

    useEffect(() => {
        async function getHardware() {
            const response = await api.get(`/hardwares/${hardware_id.id}`);
            const data = await response.data;

            setCode(data.code);
            setDescription(data.description);
            setBrand(data.brand);
            setWarranty(data.warranty);
            setHasOffice(data.has_office);
            setAuction(data.auction);
            setDateAuction(data.date_auction);
            setCategory(data.category.id);

            setHardware(data);
        }
        getHardware();
    }, [hardware_id.id]);

    useEffect(() => {
        async function getAllTypes() {
            const response = await api.get('/types');
            const data = await response.data;

            setTypes(data);
        }

        getAllTypes();
    }, []);

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
            auction,
            date_auction,
            type_id,
            department_id
        }

        await api.put(`/hardwares/${id}`, new_data);
		
        history.goBack();
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
    function handleAuction(e) {
        setAuction(e.target.value);
    }
    function handleDateAuction(e) {
        setDateAuction(e.target.value);
    }
    function handleCategory(e) {
        setCategory(e.target.value);
    }

    return (
        <Container className="center">
            <Row className="no_padding">
                <Col>
                    <h3 className="text-center margin_top_bottom_20">Editar dados do equipamento {hardware.code}</h3>
                    <Form>
                        {
                            hardware !== undefined ?
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

                                        <Label className="margin_top_10" for="labelAuction">Leilão</Label>
                                        <Input
                                            type="select"
                                            name="auction"
                                            id="labelAuction"
                                            value={auction}
                                            onChange={handleAuction}
                                            className="margin_bottom_20"
                                        >
                                            <option key={0} value={true}>FOI PARA LEILÃO</option>
                                            <option key={1} value={false}>NÃO FOI PARA LEIÃO</option>
                                        </Input>

                                        {auction === 'true' &&
                                            <>
                                                <Label className="margin_top_10" for="labelDateAuction">Data de saída para leilão</Label>
                                                <Input
                                                    type="date"
                                                    name="date_auction"
                                                    id="labelDateAuction"
                                                    placeholder="Data de saída para leilão"
                                                    value={date_auction === null ? '' : date_auction}
                                                    onChange={handleDateAuction}
                                                    className="margin_bottom_20"
                                                />
                                            </>
                                        }

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
													onClick={()=> { history.goBack() }}
												>Voltar</Button>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </>
                                : ''
                        }
                    </Form>
                </Col>
            </Row>
        </Container >
    );
}