import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUsersPetsById } from '../Helpers/api';
import { Scroll } from '../components/search/Scroll';
import { SearchList } from '../components/search/SearchList';


function MyPets() {

    const [tabValue, setTabValue] = useState(0);
    const [pets, setPets] = useState([]);
    const [savedPets, setSavedPets] = useState([]);
    const { authApiKey, userId } = useContext(AuthContext);


    const handleTabChange = (event, newValue) => {
        console.log("newValue", newValue);
        setTabValue(newValue);
    };

    async function getUsersPets() {

        const result = await getUsersPetsById(userId, authApiKey);

        if (!result.success) {
            console.log("Error", result.data);
        }
        else {

            if (typeof result.data == 'object') {
                setPets(result.data.pets);
                setSavedPets(result.data.savedPets);

                console.log("result pets", result);
            }
            else {
                alert(result.data);
            }
        }
    }

    useEffect(() => {
        getUsersPets();
    }, [authApiKey]);


    function petsList() {
        return (
            <>
                {
                    !tabValue ?
                        <Scroll>
                            {
                                pets.length > 0 ? <SearchList filteredPets={pets} /> : <p>You currently do not own or foster any pets</p>
                            }
                        </Scroll>
                        :
                        <Scroll>
                            {
                                savedPets.length > 0 ? <SearchList filteredPets={savedPets} /> : <p>You currently do not saved any pets</p>
                            }

                        </Scroll>
                }
            </>


        );
    }

    return (
        <>
            <h3>My Pets</h3>

            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Pets" />
                    <Tab label="Saved Pets" />
                </Tabs>
            </Box>

            {petsList()}

        </>
    )
}

export default MyPets;