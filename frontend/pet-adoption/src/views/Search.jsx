import { useEffect, useState, useContext } from 'react';
import { Scroll } from '../components/search/Scroll';
import { SearchList } from '../components/search/SearchList';
import { PetCard } from '../components/search/PetCard';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'
import './Search.css'
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


function Search() {

    const navigate = useNavigate();
    const { authApiKey } = useContext(AuthContext);

    const [pets, setPets] = useState([]);
    const [searchShow, setSearchShow] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [petType, setPetType] = useState("");
    const [petAdoptionStatus, setPetAdoptionStatus] = useState("");
    const [petHeight, setPetHeight] = useState("");
    const [petWeight, setPetWeight] = useState("");
    const [petName, setPetName] = useState("");
    const [filtered, setFiltered] = useState([]);


    async function getPetsDetails() {

        console.log("authApiKey", authApiKey);

        if (authApiKey) {
            try {
                const repsonse = await fetch(`http://localhost:3001/pet`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authApiKey}`
                    }
                });

                switch (repsonse.status) {
                    case 400:
                    case 401:
                    case 500:
                        navigate('/');

                        break;
                    case 200:
                        const result = await repsonse.json();
                        setPets(result.pets);
                        console.log(result);

                        break;
                    default:
                        break;
                }

            } catch (e) {
                console.log(e);
            }
        }

    }

    useEffect(() => {
        getPetsDetails();
    }, [authApiKey]);


    const handleChange = () => {

        const filtered = pets.filter(
            pet => {
                return (
                    (petType !== '' &&
                        pet.type
                            .toLowerCase()
                            .includes(petType.toLowerCase())) ||

                    (petName !== '' &&
                        pet.name
                            .toLowerCase()
                            .includes(petName.toLowerCase())) ||

                    (petHeight !== '' &&
                        pet.height
                            .toLowerCase()
                            .includes(petHeight.toLowerCase())) ||

                    (petWeight !== '' &&
                        pet.weight
                            .toLowerCase()
                            .includes(petWeight.toLowerCase())) ||

                    (petAdoptionStatus !== '' &&
                        pet.adoption_status
                            .toLowerCase()
                            .includes(petAdoptionStatus.toLowerCase()))
                );
            }
        );

        setFiltered(filtered);
    };

    useEffect(() => {
        setFiltered(pets);
    }, [pets])

    function searchList() {
        return (
            <Scroll>
                <SearchList filteredPets={filtered} />
            </Scroll>
        );
    }


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setPetType('');
        setPetAdoptionStatus('');
        setPetHeight('');
        setPetWeight('');
        setPetName('');
    };

    return (
        <>
            <h3>Search</h3>

            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Basic Search" />
                    <Tab label="Advanced Search" />
                </Tabs>
            </Box>

            <div className="pt-4">
                <TextField
                    size="small"
                    multiline={true}
                    rows={1}
                    id="outlined-basic"
                    variant="outlined"
                    label="Pet type"

                    onChange={(e) => {
                        handleChange(e)
                        setPetType(e.target.value);
                    }}
                />

                {tabValue ?
                    <>
                        <TextField
                            size="small"
                            multiline={true}
                            rows={1}
                            id="outlined-basic"
                            variant="outlined"
                            label="Pet Adoption Status"
                            onChange={(e) => {
                                handleChange(e);
                                setPetAdoptionStatus(e.target.value);
                            }}
                        />

                        <TextField
                            size="small"
                            multiline={true}
                            rows={1}
                            id="outlined-basic"
                            variant="outlined"
                            label="Pet Height"
                            onChange={(e) => {
                                handleChange(e);
                                setPetHeight(e.target.value);
                            }}
                        />

                        <TextField
                            size="small"
                            multiline={true}
                            rows={1}
                            id="outlined-basic"
                            variant="outlined"
                            label="Pet Weight"
                            onChange={(e) => {
                                handleChange(e);
                                setPetWeight(e.target.value);
                            }}
                        />

                        <TextField
                            size="small"
                            multiline={true}
                            rows={1}
                            id="outlined-basic"
                            variant="outlined"
                            label="Pet Name"
                            onChange={(e) => {
                                handleChange(e);
                                setPetName(e.target.value);
                            }}
                        />
                    </>
                    : null}
            </div>

            {searchList()}

        </>
    )
}

export default Search;