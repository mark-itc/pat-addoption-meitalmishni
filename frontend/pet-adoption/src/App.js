import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './views/Home';
import Search from './views/Search';
import Profile from './views/Profile';
import MyPets from './views/MyPets';
import AddPet from './views/AddPet';
import Dashboard from './views/Dashboard';
import Pet from './views/Pet';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { PetContext } from './context/PetContext';
import { AppNavbar } from './components/AppNavbar'
import ProtectedRoute from './Helpers/protectedRoute';


function App() {

  const navigate = useNavigate();

  const { authApiKey, setAuthApiKey, userId } = useContext(AuthContext);
  const { petId } = useContext(PetContext);
  const [petsDetails, setPetsDetails] = useState([]);

  // async function getPetsDetails() {

  //   console.log("authApiKey", authApiKey);

  //   if (authApiKey) {
  //     try {
  //       const repsonse = await fetch(`http://localhost:3001/pet`, {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': `Bearer ${authApiKey}`
  //         }
  //       });

  //       switch (repsonse.status) {
  //         case 400:
  //         case 401:
  //         case 500:
  //           navigate('/');

  //           break;
  //         case 200:
  //           const result = await repsonse.json();
  //           setPetsDetails(result.pets);
  //           console.log(result);

  //           break;
  //         default:
  //           break;
  //       }

  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }

  // }

  // useEffect(() => {
  //   getPetsDetails();
  // }, []);

  return (
    <div className="App">

      <AppNavbar />

      <div className="content-item container">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<ProtectedRoute><Search details={petsDetails} /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/myPets' element={<ProtectedRoute><MyPets /></ProtectedRoute>} />
          <Route path='/addPet' element={<ProtectedRoute><AddPet /></ProtectedRoute>} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/pet' element={<ProtectedRoute><Pet petId={petId} /></ProtectedRoute>} />

        </Routes>
      </div>
    </div >
  );
}

export default App;
