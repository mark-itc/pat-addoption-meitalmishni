import { useState, useContext } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { handleAddPetFormFormValidation } from '../Helpers/api';
import { AuthContext } from '../context/AuthContext';
import { base64 } from '../Helpers/base64';


function AddPet() {

    const { authApiKey, setAuthApiKey } = useContext(AuthContext);

    const [type, setType] = useState('');
    const [name, setName] = useState('');
    const [adoptionStatus, setAdoptionStatus] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [color, setColor] = useState('#EEE368');
    const [dietaryRestrictions, setDietaryRestrictions] = useState('');
    const [breed, setBreed] = useState('');
    const [hypoallergenic, setHypoallergenic] = useState('No');
    const [bio, setBio] = useState('');
    const [pictureName, setPictureName] = useState('');
    const [pictureType, setPictureType] = useState('');
    const [pictureBase64, setPictureBase64] = useState('');
    const [errors, setErrors] = useState({});


    const addNewPet = async () => {

        try {

            const repsonse = await fetch(`http://localhost:3001/pet`, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    'Authorization': `Bearer ${authApiKey}`
                },
                body: JSON.stringify({
                    type: type,
                    name: name,
                    adoptionStatus: adoptionStatus,
                    height: height,
                    weight: weight,
                    color: color,
                    dietaryRestrictions: dietaryRestrictions,
                    breed: breed,
                    hypoallergenic: hypoallergenic,
                    bio: bio,
                    pictureName: pictureName,
                    pictureType: pictureType,
                    pictureBase64: pictureBase64,
                })
            });

            switch (repsonse.status) {
                case 400:
                case 500:
                    const repsonseMessage = JSON.parse(await repsonse.text()).message;
                    alert(repsonseMessage);
                    setType('');

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

    const addPetFormValidation = (event) => {
        const newErrors = handleAddPetFormFormValidation({
            type: type,
            name: name,
            adoptionStatus: adoptionStatus,
            height: height,
            weight: weight,
            color: color,
            dietaryRestrictions: dietaryRestrictions,
            breed: breed,
            hypoallergenic: hypoallergenic,
            bio: bio,
            pictureType: pictureType
        });

        setErrors(newErrors);
        console.log("newErrors", newErrors);

        if (Object.keys(newErrors).length > 0) {
            //event.preventDefault();
            return false;
        }

        addNewPet();
    };

    return (
        <>
            <h3>Add Pet</h3>

            <div className="content d-flex justify-content-center align-header">
                <Form className="w-50">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Type</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Type"
                            onChange={(e) => {
                                setType(e.target.value);
                            }}
                            isInvalid={!!errors.type}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.type}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Name"
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Adoption Status</Form.Label>
                        {/* <Form.Control
                            type="text"
                            placeholder="Adoption Status"
                            onChange={(e) => {
                                setAdoptionStatus(e.target.value);
                            }}
                            isInvalid={!!errors.adoptionStatus}
                        /> */}
                        <Form.Select
                            size="sm"
                            onChange={(e) => {
                                setAdoptionStatus(e.target.value);
                            }}
                            isInvalid={!!errors.adoptionStatus}
                        >
                            <option>Available</option>
                            <option>Adopted</option>
                            <option>Fostered</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.adoptionStatus}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Height</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Height"
                            onChange={(e) => {
                                setHeight(e.target.value);
                            }}
                            isInvalid={!!errors.height}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.height}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Weight</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Weight"
                            onChange={(e) => {
                                setWeight(e.target.value);
                            }}
                            isInvalid={!!errors.weight}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.weight}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="exampleColorInput">Color</Form.Label>
                        {/* <Form.Control
                            type="color"
                            id="exampleColorInput"
                            defaultValue="#EEE368"
                            title="Choose pet color"
                            onChange={(e) => {
                                setColor(e.target.value);
                            }}
                            isInvalid={!!errors.dietaryRestrictions}
                        /> */}
                        <Form.Control
                            type="text"
                            placeholder="Color"
                            onChange={(e) => {
                                setColor(e.target.value);
                            }}
                            isInvalid={!!errors.color}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.color}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Dietary Restrictions</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Dietary Restrictions"
                            onChange={(e) => {
                                setDietaryRestrictions(e.target.value);
                            }}
                            isInvalid={!!errors.dietaryRestrictions}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dietaryRestrictions}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Breed</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Breed"
                            onChange={(e) => {
                                setBreed(e.target.value);
                            }}
                            isInvalid={!!errors.breed}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.breed}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Bio</Form.Label>
                        <FloatingLabel
                            controlId="floatingTextarea"
                            label="Pet bio"
                            className="mb-3"
                        >
                            <Form.Control
                                as="textarea"
                                onChange={(e) => {
                                    setBio(e.target.value);
                                }}
                                isInvalid={!!errors.bio}
                            />
                        </FloatingLabel>
                        <Form.Control.Feedback type="invalid">
                            {errors.bio}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Hypoallergenic</Form.Label>
                        <Form.Select
                            size="sm"
                            onChange={(e) => {
                                setHypoallergenic(e.target.value);
                            }}
                            isInvalid={!!errors.hypoallergenic}
                        >
                            <option>No</option>
                            <option>Yes</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.hypoallergenic}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Picture</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => {
                                setPictureName(e.target.files[0].name);
                                setPictureType(e.target.files[0].type);

                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = () => {
                                    setPictureBase64(reader.result.replace(/^data:image\/\w+;base64,/, ""));
                                };

                            }}
                            isInvalid={!!errors.picture}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.picture}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* <Button className="custom-buttom" variant="primary" onClick={addPetFormValidation}>
                        Add Pet
                    </Button> */}
                    <button type="button" className="custom-buttom" onClick={addPetFormValidation}>Add Pet</button>
                </Form>
            </div>
        </>
    )
}

export default AddPet;