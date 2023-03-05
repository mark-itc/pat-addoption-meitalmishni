import { useContext, useState } from "react";
import { AuthContext } from '../context/AuthContext';
import { Navigate } from "react-router-dom";
import localForage from "localforage";


function ProtectedAdminRoute({ children }) {
    const { authApiKey, userRole } = useContext(AuthContext);

    async function getFromForage() {
        const creds = await localForage.getItem('user_credentials');
        return creds;
    }

    async function routeHelper() {
        const creds = await getFromForage();
        console.log("creds", creds);
        console.log("authApiKey route", authApiKey);
        console.log("userRole route", userRole);

        return creds;
        // if (creds && (!creds.apiKey || !creds.role)) {
        //     console.log("here 1");
        //     return <Navigate to="/" />;
        // }
        // else {
        //     console.log("here 2");
        //     return children;
        // }
    }

    if (!authApiKey || !userRole) {
        const helper = routeHelper();

        helper.then((res) => {
            console.log("res", res);

        })
        return children;
    }
}


export default ProtectedAdminRoute;