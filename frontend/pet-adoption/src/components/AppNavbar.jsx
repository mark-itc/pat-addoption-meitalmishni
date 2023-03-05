import './AppNavbar.css'
import { useContext } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";


export function AppNavbar() {

    const navigate = useNavigate();
    const { authApiKey, setAuthApiKey, setUserId, setUserRole, userRole } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            setAuthApiKey('');
            setUserId('');
            setUserRole(0);
            navigate('/');

        } catch (e) {
            console.log(e.message);
        }
    }

    return (
        <Navbar className="w-100" variant="light" >
            <Container className='navbar-container'>
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    {
                        authApiKey ?
                            <>
                                {
                                    userRole ?
                                        <>
                                            <Nav.Link href="/addPet">Add Pet</Nav.Link>
                                            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                                        </>
                                        :
                                        <>
                                            <Nav.Link href="/search">search</Nav.Link>
                                            <Nav.Link href="/mypets">My pets</Nav.Link>
                                            <Nav.Link href="/profile">Profile</Nav.Link>
                                        </>
                                }

                                <button className='logout' onClick={handleLogout}>Logout</button>
                            </>
                            : null
                    }
                </Nav>
            </Container>
        </Navbar>
    )
}