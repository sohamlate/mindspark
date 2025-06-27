import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDashboard from './components/dashboard';
import PrescriptionDashboard from './components/prescriptiondashboard';
import PrescriptionPage from './components/prescription';// New import
import MedicationForm from './components/MedicationForm';
import MedicationList from './components/MedicationList';
import LandingPage from '../src/components/landingPage';
import Login from '../src/components/login';
import Signup from '../src/components/signup';  
import './styles.css';
import  { useState , useEffect} from 'react';
import { useNavigate,useLocation  } from "react-router-dom";
import axios from "axios";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';





const App = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  
  const [user, setUser] = useState({});   
  

  useEffect(() => { 
       const autoLogin = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          if (isProtectedRoute(routerLocation.pathname)) {
            console.log("Token missing, redirecting to login");
            navigate("/login");
          }
          return;
        }

        const response = await axios.post(
          "http://localhost:3001/api/rootuser/autoLogin",
          { token }
        );

        if (response.data.success) {
          setUser(response.data.data);
        } else {
          if (isProtectedRoute(routerLocation.pathname)) {
            navigate("/login");
          }
        }
      } catch (error) {
        if (isProtectedRoute(routerLocation.pathname)) {
          navigate("/login");
        }
        console.error("Auto-login failed:", error.message);
      }
    };

    autoLogin();
  }, [routerLocation.pathname]); // runs when route changes

  const isProtectedRoute = (path) => {
    const publicRoutes = [
      "/login",
      "/signup",
      "/forgot-password",
    ];
    return !publicRoutes.includes(path) && !path.startsWith("/reset-password");
  };



  return (

    <div>
        

      <Routes>
      <Route path="/" element={<LandingPage user ={user } setUser={setUser} />} />
        <Route path="/dashboard" element={<UserDashboard user={user } />} />
        <Route path="/:id" element={<PrescriptionDashboard user= {user} />} />
        <Route path="/:username/:prescriptionTitle" element={<PrescriptionPage users={user} />} />
        <Route path="/login" element={<Login user={user } setUser = {setUser} />} />
        <Route path="/signup" element={<Signup user={user} />} />
        
        <Route path="/:id" element={<PrescriptionDashboard user={user} />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/:userId/prescriptions/:prescriptionId" element={<PrescriptionPage user={user} />} />
      </Routes>


      </div>
    
  );
};

export default App;
