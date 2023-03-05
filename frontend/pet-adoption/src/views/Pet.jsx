import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { getPetById } from '../Helpers/api';
import { returnPet } from '../Helpers/api';
import { savePet } from '../Helpers/api';
import { deleteSavedPet } from '../Helpers/api';
import { setPetAdoption } from '../Helpers/api';
import { handleUpdatePetFormFormValidation } from '../Helpers/api';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import AWS from 'aws-sdk';
import './Pet.css'


function Pet(props) {

    const navigate = useNavigate();

    const { petId } = props;
    const { authApiKey, userRole } = useContext(AuthContext);
    const [pet, setPet] = useState('');
    const [isUserOwnPet, setIsUserOwnPet] = useState(false);
    const [status, setStatus] = useState('');
    const [isUserSavedPet, setIsUserSavedPet] = useState(false);
    const [picture, setPicture] = useState('');

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

    console.log("petId", petId);

    async function getPetDetails() {

        const result = await getPetById(petId, authApiKey);

        if (!result.success) {
            console.log("Error", result.data);
        }
        else {

            if (typeof result.data == 'object') {
                setPet(result.data.pet);
                setIsUserOwnPet(result.data.isUserOwnPet);
                setIsUserSavedPet(result.data.isUserSavedPet);
                const status = (result.data.petStatus === 'Adopted' || result.data.petStatus === 'Fostered') ? true : false;
                setStatus(status);
                console.log("result", result);

                setType(result.data.pet.type);
                setName(result.data.pet.name);
                setAdoptionStatus(result.data.pet.adoption_status);
                setHeight(result.data.pet.height);
                setWeight(result.data.pet.weight);
                setColor(result.data.pet.color);
                setDietaryRestrictions(result.data.pet.dietary_restrictions);
                setBreed(result.data.pet.breed);
                setHypoallergenic(result.data.pet.hypoallergenic);
                setBio(result.data.pet.bio);


                AWS.config.update({
                    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
                    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
                    region: 'me-central-1'
                });
                const s3 = new AWS.S3();

                const params = {
                    Bucket: process.env.REACT_APP_BUCKET_NAME,
                    Key: result.data.pet.picture,
                    Expires: 60 * 60
                };

                const image = s3.getSignedUrl('getObject', params);
                setPicture(image);
            }
            else {
                alert(result.data);
            }
        }
    }

    async function returnPetHandler() {

        const result = await returnPet(petId, authApiKey);

        if (!result.success) {
            console.log("Error", result.data);
        }
        else {
            alert("Pet returned to the adoption center");
            navigate('/myPets');
        }
    }

    async function savePetHandler() {

        const result = await savePet(petId, authApiKey);

        if (!result.success) {
            console.log("Error", result.data);
        }
        else {
            alert("Pet saved successfully");
            navigate('/myPets');
        }
    }


    async function deleteSavedPetHandler() {

        const result = await deleteSavedPet(petId, authApiKey);

        if (!result.success) {
            console.log("Error", result.data);
        }
        else {
            alert("Saved pet deleted successfully");
            navigate('/myPets');
        }
    }


    async function adoptPetHandler(status) {

        console.log("status", status);

        const result = await setPetAdoption(petId, authApiKey, status);

        if (!result.success) {
            console.log("Error", result.data);
        }
        else {
            alert(`${status}ed successfully`);
            navigate('/myPets');
        }
    }


    const editPet = async () => {

        try {
            const repsonse = await fetch(`http://localhost:3001/pet/${petId}`, {
                method: 'put',
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
                    //setType('');

                    break;
                case 200:
                    const result = await repsonse.json();
                    console.log("result", result);
                    alert("Saved successfully");
                    setPet(result.updatedPet);

                    break;
                default:
                    break;
            }

        } catch (e) {
            console.log("Error");
        }
    }

    const updatePetFormValidation = (event) => {
        const newErrors = handleUpdatePetFormFormValidation({
            type: type,
            name: name,
            adoptionStatus: adoptionStatus,
            height: height,
            weight: weight,
            color: color,
            dietaryRestrictions: dietaryRestrictions,
            breed: breed,
            hypoallergenic: hypoallergenic,
            bio: bio
        });

        setErrors(newErrors);
        console.log("newErrors", newErrors);

        if (Object.keys(newErrors).length > 0) {
            //event.preventDefault();
            return false;
        }

        editPet();
    };


    useEffect(() => {
        getPetDetails();
    }, [])

    return (
        <>
            <div className="content d-flex justify-content-center align-header pet-content">
                <div>
                    <h3 className="pet-name">{pet ? pet.name : null}</h3>
                    <img src={picture} className="pet-image" alt="My Image" />
                </div>

                <div>
                    {
                        !userRole ?
                            <>
                                {
                                    pet ?
                                        <div className="pet-item">

                                            <div className="pet-details">
                                                <p><b>Type:</b> {pet.type}</p>
                                                <p><b>height:</b> {pet.height}</p>
                                                <p><b>Weight:</b> {pet.weight}</p>
                                                <p><b>Color:</b> {pet.color}</p>
                                                <p><b>Hypoallergenic:</b> {pet.hypoallergenic}</p>
                                                <p><b>Dietary restrictions:</b> {pet.dietary_restrictions}</p>
                                                <p><b>Adoption Status:</b> {pet.adoption_status}</p>
                                                <p><b>Breed:</b> {pet.breed}</p>
                                                <p><b>Bio:</b> {pet.bio}</p>
                                            </div>

                                        </div>
                                        : null
                                }

                                <div className="pet-button">
                                    {
                                        isUserOwnPet ?
                                            <button className="custom-buttom" onClick={returnPetHandler}>Return to adoption center</button>
                                            :
                                            <div className="adopt-foster">
                                                <button className="custom-buttom" disabled={status} onClick={() => { adoptPetHandler("Adopt") }}>Adopt</button>
                                                <button className="custom-buttom" disabled={status} onClick={() => { adoptPetHandler("Foster") }}>Foster</button>

                                                {
                                                    isUserSavedPet ?
                                                        <button className="custom-buttom" onClick={deleteSavedPetHandler}>Delete Save</button>
                                                        :
                                                        <button className="custom-buttom" onClick={savePetHandler}>Save For Later</button>
                                                }
                                            </div>

                                    }
                                </div>
                            </>
                            :
                            <>
                                <Form className="w-50 pet-form">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Type</Form.Label>
                                        <Form.Control
                                            defaultValue={type}
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
                                            defaultValue={name}
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
                                        <Form.Select
                                            value={adoptionStatus}
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
                                            defaultValue={height}
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
                                            defaultValue={weight}
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
                                        <Form.Control
                                            defaultValue={color}
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
                                            defaultValue={dietaryRestrictions}
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
                                            defaultValue={breed}
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
                                                defaultValue={bio}
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
                                            value={hypoallergenic}
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

                                    <button type="button" className="custom-buttom" onClick={updatePetFormValidation}>Add Pet</button>
                                </Form>
                            </>
                    }
                </div>
            </div>
        </>
    )
}

export default Pet