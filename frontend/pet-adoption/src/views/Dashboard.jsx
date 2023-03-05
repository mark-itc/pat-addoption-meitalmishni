import { useEffect, useContext, useState } from "react";
import { AuthContext } from '../context/AuthContext';
import { PetContext } from '../context/PetContext';
import { getUsersList } from '../Helpers/api';
import { getUsersPets } from '../Helpers/api';
import { getPetsList } from '../Helpers/api';
import Table from 'react-bootstrap/Table';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ModalBox } from '../components/dashboard/ModalBox';
import { useNavigate } from "react-router-dom";


function Users() {

    const navigate = useNavigate();

    const { authApiKey } = useContext(AuthContext);
    const { petId, setPetId } = useContext(PetContext);
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState([]);
    const [userPets, setUserPets] = useState([]);
    const [pets, setPets] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [showModal, setShowModal] = useState(false);

    async function getUsersListHelper() {

        const result = await getUsersList(authApiKey);

        if (!result.success) {
            console.log("Error", result.data);
        }
        else {

            if (typeof result.data == 'object') {
                setUsers(result.data.users);
                console.log("result", result);
            }
            else {
                alert(result.data);
            }
        }
    }


    async function getPetsListHelper() {

        const result = await getPetsList(authApiKey);

        if (!result.success) {
            console.log("Error", result.data);
        }
        else {

            if (typeof result.data == 'object') {
                setPets(result.data.pets);
                console.log("result", result);
            }
            else {
                alert(result.data);
            }
        }
    }


    useEffect(() => {
        getUsersListHelper();
        getPetsListHelper();
    }, [authApiKey]);


    const openUserDetails = async (user) => {

        setUserData(user);
        const result = await getUsersPets(user.id, authApiKey);

        if (!result.success) {
            console.log("Error", result.data);
            setShowModal(false);
        }
        else {

            if (typeof result.data == 'object') {
                setUserPets(result.data.pets);
                setShowModal(true);
            }
            else {
                alert(result.data);
                setShowModal(false);
            }
        }
    }

    function usersList() {
        return (
            <>
                <Table striped>
                    <thead>
                        <tr>
                            {/* <th>Email</th> */}
                            <th>First Name</th>
                            <th>Last Name</th>
                            {/* <th>Phone</th>
                            <th>Bio</th>
                            <th>Role</th> */}
                        </tr>
                    </thead>
                    <tbody>

                        {
                            users.map((user) => (
                                <tr key={user.id}>
                                    {/* <td>{user.email}</td> */}
                                    <td onClick={() => {
                                        openUserDetails(user)
                                    }}>
                                        {user.first_name}
                                    </td>
                                    <td>{user.last_name}</td>
                                    {/* <td>{user.phone}</td>
                                    <td>{user.bio}</td>
                                    <td>{user.role}</td> */}
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </>
        )
    }

    function handlePetEdit(petId) {
        setPetId(petId);
        navigate('/pet');
    }


    function petsList() {

        return (
            <>
                <Table striped>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Adoption Status</th>
                            <th>Height</th>
                            <th>Weight</th>
                            <th>color</th>
                            <th>bio</th>
                            <th>Hipoallergenic</th>
                            <th>Dietary Restrictions</th>
                            <th>Breed</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            pets.map((pet) => (
                                <tr key={pet.id}>
                                    <td>{pet.type}</td>
                                    <td>{pet.name}</td>
                                    <td>{pet.adoption_status}</td>
                                    <td>{pet.height}</td>
                                    <td>{pet.weight}</td>
                                    <td>{pet.color}</td>
                                    <td>{pet.bio}</td>
                                    <td>{pet.hypoallergenic}</td>
                                    <td>{pet.dietary_restrictions}</td>
                                    <td>{pet.breed}</td>
                                    <td>
                                        <button onClick={() => {
                                            handlePetEdit(pet.id);
                                        }}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </>
        )
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };


    return (
        <>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Users" />
                    <Tab label="Pets" />
                </Tabs>
            </Box>

            {!tabValue ? usersList() : petsList()}

            {
                showModal ? <ModalBox visibility={showModal} handleModalClose={handleModalClose} userData={userData} userPets={userPets} /> : null
            }
        </>
    )
}

export default Users;