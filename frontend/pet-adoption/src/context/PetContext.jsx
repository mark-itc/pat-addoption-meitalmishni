import { useState, useEffect } from "react";
import { createContext } from "react";
import localForage from "localforage";

const PetContext = createContext();

function PetContextProvider({ children }) {

    const [petId, setPetId] = useState('');

    async function getFromForage() {
        const petId = await localForage.getItem('petId');
        if (petId) {
            setPetId(petId);
        }
    }

    useEffect(() => {
        getFromForage();
    }, [])

    useEffect(() => {
        localForage.setItem('petId', petId);
    }, [petId])


    return (
        <PetContext.Provider value={{ petId, setPetId }}>
            {children}
        </PetContext.Provider>
    )
}

export { PetContext, PetContextProvider };