import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Container, Row, Col, Button } from 'reactstrap';

import './index.css';

import api from '../../services/api';

// import { Link } from 'react-router-dom';

export default function EditHardware() {
    const hardware_id = useParams();

    const [hardware, setHardware] = useState([]);
    const [types, setTypes] = useState([]);
    const [heritage, setHeritage] = useState([]);
    const [description, setDescription] = useState([]);
    const [brand, setBrand] = useState([]);
    const [warranty, setWarranty] = useState([]);
    const [has_office, setHasOffice] = useState([]);
    const [auction, setAuction] = useState([]);
    const [date_auction, setDateAuction] = useState([]);
    const [category, setCategory] = useState([]);

    const history = useHistory();

    useEffect(() => {
        async function getHardware() {
            const response = await api.get(`/hardwares/${hardware_id.heritage}`);
            const data = await response.data;

            setHeritage(data[0].heritage);
            setDescription(data[0].description);
            setBrand(data[0].brand);
            setWarranty(data[0].warranty);
            setHasOffice(data[0].has_office);
            setAuction(data[0].auction);
            setDateAuction(data[0].date_auction);
            setCategory(data[0].category.id);

            setHardware(data);
        }
        getHardware();
    }, [hardware_id.heritage]);

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
        const department_id = hardware[0].belongs.id;
        const id = hardware[0].id;

        const new_data = {
            id,
            heritage,
            description,
            brand,
            warranty,
            has_office,
            auction,
            date_auction,
            type_id,
            department_id
        }

        const response = await api.put(`/hardwares/${id}`, new_data);
        const data = await response.data;

        setHardware([data]);
        history.goBack();
    };

    function handleHeritage(e) {
        setHeritage(e.target.value);
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
        <Container className="height_content center">
            <Row className="no_padding width_70">
                <Col>
                    <Form>
                        {
                            hardware[0] !== undefined ?
                                <>
                                    <FormGroup key={hardware[0].id}>
                                        <Label className="margin_top_10" for="labelHeritage">Tombamento</Label>
                                        <Input
                                            type="text"
                                            name="heritage"
                                            id="labelHeritage"
                                            placeholder="Tombamento"
                                            value={heritage}
                                            onChange={handleHeritage}
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
                                            type="text"
                                            name="warranty"
                                            id="labelWarranty"
                                            placeholder="Garantia"
                                            defaultValue={warranty}
                                            onChange={handleWarranty}
                                            className="margin_bottom_20"
                                        />

                                        <Label className="margin_top_10" for="labelHasOffice">Tem office</Label>
                                        <Input
                                            type="text"
                                            name="has_office"
                                            id="labelHasOffice"
                                            placeholder="Tem office?"
                                            defaultValue={has_office}
                                            onChange={handleHasOffice}
                                            className="margin_bottom_20"
                                        />

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

                                        { auction === 'true' &&
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
                                                <Button color="success" className="margin_left_right_20" onClick={updateHardware}>Salvar</Button>
                                                <Button className="margin_left_right_20" onClick={() => { history.goBack() }}>Voltar</Button>
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