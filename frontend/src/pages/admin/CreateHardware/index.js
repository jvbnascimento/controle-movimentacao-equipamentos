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
    FormFeedback
} from 'reactstrap';

import api from '../../../services/api';
import AuthContext from '../../../contexts/auth';

export default function CreateHardware() {
    const [types, setTypes] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [warranty, setWarranty] = useState('');
    const [has_office, setHasOffice] = useState('SEM OFFICE');
    const [category, setCategory] = useState(1);
    const [belongs, setBelongs] = useState([1, '']);
    const [codeValid, setCodeValid] = useState(false);
    const [descriptionValid, setDescriptionValid] = useState(false);
    const [brandValid, setBrandValid] = useState(false);
    const [warrantyValid, setWarrantyValid] = useState(false);
    const [visible, setVisible] = useState(false);
    const { message, setMessage, colorMessage } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        async function getAllTypes() {
            const response = await api.get('/types');
            const data = await response.data.types;

            if (data.length !== 0) {
                setTypes(data);
            }
        }

        getAllTypes();
    }, []);

    useEffect(() => {
        async function getAllDepartments() {
            const response = await api.get('/departments');
            const data = await response.data.departments;

            if (data.length !== 0) {
                setDepartments(data);
                setBelongs([data[0].id, data[0].boss]);
            }
        }

        getAllDepartments();
    }, []);

    useEffect(() => {
        function verifyMessage() {
            if (message[0] !== '') {
                setVisible(true);
            }
        }

        verifyMessage();
    }, [message]);

    const codeValidator = (data) => {
        if (data.length === 7) {
            return (/(\d{2})(-){1}(\d{4})(\D)*/gm.test(data));
        }
        else if (data.length === 8) {
            return (/(\d{2})(-){1}(\d{5})(\D)*/gm.test(data));
        }
        return false;
    }

    const emptyFieldValidator = (data) => {
        return (/^\S.*/gm.test(data));
    }

    // CLOSE MODAL
    const onDismiss = () => {
        setVisible(false);
    }

    // VERIFY IF ALL INPUTS ARE VALID
    const verifyAllInputsValid = () => {
        if (
            codeValidator(code) &&
            emptyFieldValidator(description) &&
            emptyFieldValidator(brand) &&
            emptyFieldValidator(warranty) &&
            types.length !== 0
        ) {
            return true;
        }
        else if (
            codeValidator(code) &&
            emptyFieldValidator(description) &&
            emptyFieldValidator(brand) &&
            emptyFieldValidator(warranty) &&
            types.length !== 0
        ) {
            return true;
        }
        return false;
    }

    // MODIFY THE HERITAGE FIELD VALUE
    const handleCode = (e) => {
        const verifyCode = e.target.value;

        if (codeValidator(verifyCode)) {
            setCodeValid(true);
        }
        else {
            setCodeValid(false)
        }

        setCode(verifyCode);
    }
    const handleDescription = (e) => {
        const verifyDescription = e.target.value;

        if (emptyFieldValidator(verifyDescription)) {
            setDescriptionValid(true);
        }
        else {
            setDescriptionValid(false)
        }

        setDescription(verifyDescription);
    }
    const handleBrand = (e) => {
        const verifyBrand = e.target.value;

        if (emptyFieldValidator(verifyBrand)) {
            setBrandValid(true);
        }
        else {
            setBrandValid(false)
        }

        setBrand(verifyBrand);
    }
    const handleWarranty = (e) => {
        const verifyWarranty = e.target.value;

        if (emptyFieldValidator(verifyWarranty)) {
            setWarrantyValid(true);
        }
        else {
            setWarrantyValid(false)
        }

        setWarranty(e.target.value);
    }
    const handleHasOffice = (e) => {
        setHasOffice(e.target.value);
    }
    const handleCategory = (e) => {
        setCategory(e.target.value);
    }
    const handleBelongs = (e) => {
        setBelongs([e.target.value, e.target.options[e.target.selectedIndex].attributes.name.value]);
    }

    const validateCreation = () => {
        const validation = verifyAllInputsValid();
        if (validation) {
            createHardware();
        }
        else {
            setMessage(["Existem campos não preenchidos corretamente", 400]);
        }
    }

    const createHardware = async () => {
        const type_id = category;
        const department_id = belongs[0];

        const new_data = {
            code,
            description,
            brand,
            warranty,
            has_office,
            type_id,
            department_id
        }

        const response = await api.post(`/${type_id}/hardwares`, new_data);

        if (response.status === 201) {
            setMessage(['Equipamento cadastrado com sucesso.', response.status]);
            history.goBack();
        }
        else {
            setMessage([response.data.error, response.data.status]);
        }
    };

    return (
        <>
            <Container className="width_30">
                <Alert color={colorMessage[message[1]]} isOpen={visible} toggle={onDismiss}>
                    {message[0]}
                </Alert>
            </Container>

            <Container className="width_30" fluid={true}>
                <Row>
                    <Col>
                        <h2 className="margin_top_bottom_20 text-center">Cadastrar novo equipamento</h2>
                        <Form>
                            <FormGroup>
                                <Label className="margin_top_10" for="labelCode">Tombamento</Label>
                                {
                                    codeValid ?
                                        <>
                                            <Input type="text" name="code" id="labelCode" placeholder="Tombamento" value={code} onChange={handleCode} className="margin_bottom_20" valid />
                                            <FormFeedback valid>Tombamento válido</FormFeedback>
                                        </>
                                        :
                                        <>
                                            <Input type="text" name="code" id="labelCode" placeholder="Tombamento" value={code} onChange={handleCode} className="margin_bottom_20" invalid />
                                            <FormFeedback>
                                                O campo <strong>TOMBAMENTO</strong> tem que ser no formato <strong>XX-XXXX ou XX-XXXXX.</strong>
                                            </FormFeedback>
                                        </>
                                }
                            </FormGroup>

                            <FormGroup>
                                <Label className="margin_top_10" for="labelCategory">Tipo</Label>
                                <Input type="select" name="category" id="labelCategory" value={category} onChange={handleCategory} className="margin_bottom_20" >
                                    {
                                        types !== undefined && types.length !== 0 ?
                                            types.map(element => {
                                                return (
                                                    <option key={element.id} value={element.id}>{element.name}</option>
                                                );
                                            })
                                            :
                                            <option>Não há categorias cadastradas ainda</option>
                                    }
                                </Input>
                            </FormGroup>

                            <FormGroup>
                                <Label className="margin_top_10" for="labelDescription">Descrição</Label>
                                {
                                    descriptionValid ?
                                        <>
                                            <Input type="text" name="description" id="labelDescription" placeholder="Descrição" defaultValue={description} onChange={handleDescription} className="margin_bottom_20" valid />
                                            <FormFeedback valid>Descrição válida</FormFeedback>
                                        </>
                                        :
                                        <>
                                            <Input type="text" name="description" id="labelDescription" placeholder="Descrição" defaultValue={description} onChange={handleDescription} className="margin_bottom_20" invalid />
                                            <FormFeedback>O campo <strong>DESCRIÇÃO</strong> não pode ser vazio.</FormFeedback>
                                        </>
                                }
                            </FormGroup>

                            <FormGroup>
                                <Label className="margin_top_10" for="labelBrand">Marca</Label>
                                {
                                    brandValid ?
                                        <>
                                            <Input type="text" name="brand" id="labelBrand" placeholder="Marca" defaultValue={brand} onChange={handleBrand} className="margin_bottom_20" valid />
                                            <FormFeedback valid>Marca válida</FormFeedback>
                                        </>
                                        :
                                        <>
                                            <Input type="text" name="brand" id="labelBrand" placeholder="Marca" defaultValue={brand} onChange={handleBrand} className="margin_bottom_20" invalid />
                                            <FormFeedback>O campo <strong>MARCA</strong> não pode ser vazio.</FormFeedback>
                                        </>
                                }
                            </FormGroup>

                            <FormGroup>
                                <Label className="margin_top_10" for="labelWarranty">Garantia</Label>
                                {
                                    warrantyValid ?
                                        <>
                                            <Input type="date" name="warranty" id="labelWarranty" placeholder="Garantia" defaultValue={warranty} onChange={handleWarranty} className="margin_bottom_20" valid />
                                            <FormFeedback valid>Data válida.</FormFeedback>
                                        </>
                                        :
                                        <>
                                            <Input type="date" name="warranty" id="labelWarranty" placeholder="Garantia" defaultValue={warranty} onChange={handleWarranty} className="margin_bottom_20" invalid />
                                            <FormFeedback>O campo <strong>GARANTIA</strong> não pode ser vazio.</FormFeedback>
                                        </>
                                }

                            </FormGroup>

                            <FormGroup>
                                {
                                    document.getElementById("labelCategory") !== null &&
                                    document.getElementById("labelCategory").options[document.getElementById("labelCategory").selectedIndex] !== null &&
                                    document.getElementById("labelCategory").options[document.getElementById("labelCategory").selectedIndex] !== undefined &&
                                    document.getElementById("labelCategory").options[document.getElementById("labelCategory").selectedIndex].text === 'COMPUTADOR DE MESA' &&
                                    <>
                                        <Label className="margin_top_10" for="labelHasOffice">Tem office</Label>
                                        <Input type="select" name="has_office" id="labelHasOffice" placeholder="Tem office?" defaultValue={has_office} onChange={handleHasOffice} className="margin_bottom_20" >
                                            <option key={0} value={'SEM OFFICE'}>SEM OFFICE</option>
                                            <option key={1} value={'2007'}>2007</option>
                                            <option key={2} value={'2013'}>2013</option>
                                            <option key={3} value={'2016'}>2016</option>
                                        </Input>
                                    </>
                                }
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                    <Col>
                                        <Label className="margin_top_10" for="labelBelongs">Departamento</Label>
                                        <Input type="select" name="belongs" id="labelBelongs" value={belongs[0]} onChange={handleBelongs} className="margin_bottom_20">
                                            {
                                                departments !== undefined && departments.length !== 0 &&
                                                departments.map(element => {
                                                    return (<option key={element.id} value={element.id} name={element.boss}>{element.name} - {element.acronym}</option>);
                                                })
                                            }
                                        </Input>
                                    </Col>

                                    <Col>
                                        <Label className="margin_top_10" for="labelBoss">Chefe</Label>
                                        <Input value={belongs[1]} readOnly />
                                    </Col>
                                </Row>
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                    <Col className="center margin_top_bottom_20">
                                        <Button className="margin_left_right_20 bg_color_verde_zimbra" onClick={validateCreation} disabled={ verifyAllInputsValid() ? false : true }>Cadastrar</Button>
                                        <Button className="margin_left_right_20" onClick={() => { history.goBack() }}>Voltar</Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}