import { useContext, useState } from "react";
import { AuthContext } from '../context/AuthContext';
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const { authApiKey } = useContext(AuthContext);
    let helper = 1;

    if (!authApiKey) {
        helper = loginHelper(1);

        if (helper) {
            return children;
        } else {
            return <Navigate to="/" />;
        }
    }

    async function loginHelper(authApiKey) {

        if (authApiKey) {
            return 1;
        }
        else {
            return 0;
        }
    }

    return children;

}

export default ProtectedRoute;