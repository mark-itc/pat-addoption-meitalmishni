import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { AuthContext } from '../../context/AuthContext';
import { handleFormValidation } from '../../Helpers/api';


export function ModalBox(props) {
    const { visibility, type, handleModalClose } = props;

    const [show, setShow] = useState(visibility);
    const { authApiKey, setAuthApiKey, userId, setUserId, userRole, setUserRole } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordTwo, setPasswordTwo] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});

    const titleText = type === 'Login' ? "Login" : "Join Us!";
    const buttonText = type === 'Login' ? "Login" : "Signup";


    const setField = (field, value) => {
        setForm({
            ...form,
            [field]: value
        })
    }

    const formValidation = () => {
        const newErrors = handleFormValidation(form, buttonText);

        setErrors(newErrors);

        if (!(Object.keys(newErrors).length > 0)) {

            if (buttonText === 'Login') handleLogin();
            else handleRegister();
        }
    };


    const handleRegister = async () => {

        try {
            const repsonse = await fetch('http://localhost:3001/signup', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({ email: email, password: password, passwordTwo: passwordTwo, firstName: firstName, lastName: lastName, phone: phone })
            });

            switch (repsonse.status) {
                case 400:
                case 401:
                case 500:
                    const repsonseMessage = JSON.parse(await repsonse.text()).message;
                    alert(repsonseMessage);

                    break;
                case 200:
                    const result = await repsonse.json();
                    // console.log(result.token);
                    // console.log(result.userId);
                    console.log("result signup", result);

                    setAuthApiKey(result.token);
                    setUserId(result.userId);
                    setUserRole(result.userRole);
                    handleModalClose();

                    break;
                default:
                    break;
            }
        } catch (e) {
            console.log("Error: ", e);
        }
    }

    const handleLogin = async () => {

        try {
            const repsonse = await fetch('http://localhost:3001/login', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email, password: password })
            })

            switch (repsonse.status) {
                case 400:
                case 401:
                case 500:
                    const repsonseMessage = JSON.parse(await repsonse.text()).message;
                    alert(repsonseMessage);

                    break;
                case 200:
                    const result = await repsonse.json();
                    // console.log(result.token);
                    // console.log(result.userId);
                    console.log("result login", result);

                    setAuthApiKey(result.token);
                    setUserId(result.userId);
                    setUserRole(result.userRole);
                    handleModalClose();

                    break;
                default:
                    break;
            }
        } catch (e) {
            console.log("Error: ", e);
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleModalClose}>
                <Form noValidate>
                    <Modal.Header closeButton>
                        <h3>{titleText}</h3>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                autoFocus
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setField('email', e.target.value);
                                }}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setField('password', e.target.value);
                                }}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {
                            type === 'Signup' ?
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm Password"
                                            onChange={(e) => {
                                                setPasswordTwo(e.target.value);
                                                setField('passwordTwo', e.target.value);
                                            }}
                                            isInvalid={!!errors.passwordTwo}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.passwordTwo}
                                        </Form.Control.Feedback>

                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>First name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="First name"
                                            onChange={(e) => {
                                                setFirstName(e.target.value);
                                                setField('firstName', e.target.value);
                                            }}
                                            isInvalid={!!errors.firstName}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.firstName}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Last name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Last name"
                                            onChange={(e) => {
                                                setLastName(e.target.value);
                                                setField('lastName', e.target.value);
                                            }}
                                            isInvalid={!!errors.lastName}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lastName}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            placeholder="Phone"
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                setField('phone', e.target.value);
                                            }}
                                            isInvalid={!!errors.phone}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.phone}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </>

                                : null
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Close
                        </Button>

                        <Button className="log-button" variant="primary" onClick={formValidation}>
                            {buttonText}
                        </Button>
                    </Modal.Footer>
                </Form>

            </Modal>
        </>
    )
}