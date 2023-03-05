import { useState, useEffect } from "react";
import { createContext } from "react";
import localForage from "localforage";

const AuthContext = createContext();

function AuthContextProvider({ children }) {

    const [authApiKey, setAuthApiKey] = useState('');
    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState(0);

    async function getFromForage() {
        const creds = await localForage.getItem('user_credentials');
        if (creds) {
            setAuthApiKey(creds.apiKey);
            setUserId(creds.id);
            setUserRole(creds.role);
        }
    }

    useEffect(() => {
        getFromForage();
    }, [])

    useEffect(() => {
        localForage.setItem('user_credentials', {
            apiKey: authApiKey,
            id: userId,
            role: userRole
        });
    }, [authApiKey])


    return (
        <AuthContext.Provider value={{ authApiKey, setAuthApiKey, userId, setUserId, userRole, setUserRole }}>
            {children}
        </AuthContext.Provider>
    )

}

export { AuthContext, AuthContextProvider };