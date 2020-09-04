import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Container, Row, Col, Button } from 'reactstrap';

import api from '../../services/api';

export default function EditHardware() {
    const [types, setTypes] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [heritage, setHeritage] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [warranty, setWarranty] = useState('');
    const [has_office, setHasOffice] = useState('SEM OFFICE');
    const [auction, setAuction] = useState('true');
    const [date_auction, setDateAuction] = useState(null);
    const [category, setCategory] = useState(1);
    const [belongs, setBelongs] = useState([1, '']);

    const history = useHistory();

    useEffect(() => {
        async function getAllTypes() {
            const response = await api.get('/types');
            const data = await response.data;

            setTypes(data);
        }

        getAllTypes();
    }, []);

    useEffect(() => {
        async function getAllDepartments() {
            const response = await api.get('/departments');
            const data = await response.data;

            setDepartments(data);
            setBelongs([data[0].id, data[0].boss]);
        }

        getAllDepartments();
    }, []);

    async function createHardware() {
        const type_id = category;
        const department_id = belongs[0];

        const new_data = {
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

        await api.post(`/${type_id}/hardwares/`, new_data);

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
    function handleBelongs(e) {
        setBelongs([e.target.value, e.target.options[e.target.selectedIndex].attributes.name.value]);
    }

    return (
        <div>
            <Container className="center" fluid={true}>
                <Row>
                    <Col>
                        <h2 className="margin_top_bottom_20 text-center">Cadastrar novo equipamento</h2>
                        <Form>
                            <FormGroup>
                                <Label className="margin_top_10" for="labelHeritage">Tombamento</Label>
                                <Input
                                    type="text"
                                    name="heritage"
                                    id="labelHeritage"
                                    placeholder="Tombamento"
                                    value={heritage}
                                    onChange={handleHeritage}
                                    className="margin_bottom_20"
                                    required={true}
                                />

                                <Label className="margin_top_10" for="labelCategory">Tipo</Label>
                                <Input
                                    type="select"
                                    name="category"
                                    id="labelCategory"
                                    value={category}
                                    onChange={handleCategory}
                                    className="margin_bottom_20"
                                    required
                                >
                                    {
                                        types !== undefined && types.length !== 0 ?
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

                                <Label className="margin_top_10" for="labelDescription">Descrição</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    id="labelDescription"
                                    placeholder="Descrição"
                                    defaultValue={description}
                                    onChange={handleDescription}
                                    className="margin_bottom_20"
                                    required
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
                                    required
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
                                    required
                                />

                                {
                                    document.getElementById("labelCategory") !== null ?
                                        document.getElementById("labelCategory")
                                            .options[
                                            document.getElementById("labelCategory").selectedIndex
                                        ] !== null ?
                                            document.getElementById("labelCategory")
                                                .options[
                                                document.getElementById("labelCategory").selectedIndex
                                            ] !== undefined ?
                                                document.getElementById("labelCategory")
                                                    .options[
                                                    document.getElementById("labelCategory").selectedIndex
                                                ].text === 'COMPUTADOR DE MESA' ?
                                                    <>
                                                        <Label className="margin_top_10" for="labelHasOffice">Tem office</Label>
                                                        <Input
                                                            type="text"
                                                            name="has_office"
                                                            id="labelHasOffice"
                                                            placeholder="Tem office?"
                                                            defaultValue={has_office}
                                                            onChange={handleHasOffice}
                                                            className="margin_bottom_20"
                                                            required
                                                        />
                                                    </>
                                                    : ''
                                                : ''
                                            : ''
                                        : ''
                                }

                                <Label className="margin_top_10" for="labelAuction">Leilão</Label>
                                <Input
                                    type="select"
                                    name="auction"
                                    id="labelAuction"
                                    value={auction}
                                    onChange={handleAuction}
                                    className="margin_bottom_20"
                                    required
                                >
                                    <option key={0} value={true}>FOI PARA LEILÃO</option>
                                    <option key={1} value={false}>NÃO FOI PARA LEILÃO</option>
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
                                            required
                                        />
                                    </>
                                }

                                <Row>
                                    <Col>
                                        <Label className="margin_top_10" for="labelBelongs">Departamento</Label>
                                        <Input
                                            type="select"
                                            name="belongs"
                                            id="labelBelongs"
                                            value={belongs[0]}
                                            onChange={handleBelongs}
                                            className="margin_bottom_20"
                                            required
                                        >
                                            {
                                                departments !== undefined && departments.length !== 0 ?
                                                    departments.map(element => {
                                                        return (
                                                            <option
                                                                key={element.id}
                                                                value={element.id}
                                                                name={element.boss}
                                                            >{element.name}</option>
                                                        );
                                                    }) : ''
                                            }
                                        </Input>
                                    </Col>

                                    <Col>
                                        <Label className="margin_top_10" for="labelBoss">Chefe</Label>
                                        <Input
                                            value={belongs[1]}
                                            readOnly
                                        />
                                    </Col>
                                </Row>


                                <Row>
                                    <Col className="center margin_top_bottom_20">
                                        <Button
                                            className="
												margin_left_right_20
												bg_color_verde_zimbra
											"
                                            onClick={createHardware}
                                        >Criar</Button>
                                        <Button
                                            className="margin_left_right_20"
                                            onClick={() => { history.goBack() }}
                                        >Voltar</Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}