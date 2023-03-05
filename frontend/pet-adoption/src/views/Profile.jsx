import { useEffect, useState, useContext } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { handleFormValidation } from '../Helpers/api';
import '../App.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { getUserDetails } from '../Helpers/api';


function Profile() {

    const navigate = useNavigate();

    const { authApiKey, setAuthApiKey, userId } = useContext(AuthContext);
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});

    const buttonText = 'Save changes';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');

    async function getUserDetailsHelper() {
        const result = await getUserDetails(userId, authApiKey);

        if (!result.success) {
            console.log("Error", result.data);
        }
        else {

            if (typeof result.data == 'object') {
                result.data.userObject.password = '';

                setForm(result.data.userObject);
                setEmail(result.data.userObject.email);
                setPassword(result.data.userObject.password);
                setFirstName(result.data.userObject.first_name);
                setLastName(result.data.userObject.last_name);
                setPhone(result.data.userObject.phone);
                setBio(result.data.userObject.bio);

                console.log("result", result);
            }
            else {
                alert(result.data);
            }
        }
    }

    useEffect(() => {
        getUserDetailsHelper();
    }, [authApiKey]);

    const setField = (field, value) => {
        setForm({
            ...form,
            [field]: value
        })
    }


    // async function getUserDetails() {

    //     try {
    //         console.log(`http://localhost:3001/user/${userId}`);

    //         const repsonse = await fetch(`http://localhost:3001/user/${userId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Bearer ${authApiKey}`
    //             }
    //         });

    //         switch (repsonse.status) {
    //             case 400:
    //             case 500:
    //                 const repsonseMessage = JSON.parse(await repsonse.text()).message;
    //                 alert(repsonseMessage);

    //                 break;
    //             case 200:
    //                 const result = await repsonse.json();
    //                 console.log(result);

    //                 break;
    //             default:
    //                 break;
    //         }

    //     } catch (e) {
    //         console.log("Error", e);
    //     }

    // }

    const handleSaveChanges = async () => {

        try {
            const repsonse = await fetch(`http://localhost:3001/user/${userId}`, {
                method: 'put',
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    'Authorization': `Bearer ${authApiKey}`
                },
                body: JSON.stringify({ email: email, password: password, firstName: firstName, lastName: lastName, phone: phone, bio: bio })
            });

            switch (repsonse.status) {
                case 400:
                case 500:
                    const repsonseMessage = JSON.parse(await repsonse.text()).message;
                    alert(repsonseMessage);

                    break;
                case 200:
                    const result = await repsonse.json();
                    console.log(result);
                    alert("Saved successfully")

                    break;
                default:
                    break;
            }

        } catch (e) {
            console.log("Error");
        }
    }

    const formValidation = () => {
        const newErrors = handleFormValidation(form, buttonText);

        setErrors(newErrors);

        console.log(Object.keys(newErrors).length);

        if (!(Object.keys(newErrors).length > 0)) {

            handleSaveChanges();
        }
    };


    return (
        <>
            <h3>Profile</h3>

            <div className="content d-flex justify-content-center align-header">
                <Form className="w-50">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            defaultValue={email}
                            type="email"
                            placeholder="name@example.com"
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
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            // defaultValue={password}
                            type="password"
                            placeholder="New Password"
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
                    <Form.Group className="mb-3">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            defaultValue={firstName}
                            type="text"
                            placeholder="First name"
                            onChange={(e) => {
                                setFirstName(e.target.value);
                                setField('first_name', e.target.value);
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
                            defaultValue={lastName}
                            type="text"
                            placeholder="Last name"
                            onChange={(e) => {
                                setLastName(e.target.value);
                                setField('last_name', e.target.value);
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
                            defaultValue={phone}
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

                    <Form.Group className="mb-3">
                        <Form.Label>Bio</Form.Label>
                        <FloatingLabel

                            controlId="floatingTextarea"
                            label="Write us aboute you"
                            className="mb-3"
                        >
                            <Form.Control
                                as="textarea"
                                defaultValue={bio}
                                onChange={(e) => {
                                    setBio(e.target.value);
                                    setField('bio', e.target.value);
                                }}
                                isInvalid={!!errors.bio}
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <button type="button" className="custom-buttom" onClick={formValidation}>{buttonText}</button>
                </Form>
            </div>

        </>
    )
}

export default Profile;