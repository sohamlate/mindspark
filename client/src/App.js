import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDashboard from '../src/components/dashboard';
import PrescriptionDashboard from '../src/components/prescriptiondashboard';
import PrescriptionPage from './components/prescription';
import './styles.css'; 

// Mock user data (in a real app, this would come from a database or API)
const users = [
  { id: 1, name: "John Doe", username: "john", imageUrl: "https://via.placeholder.com/150/4A90E2/FFFFFF?text=JD" },
  { id: 2, name: "Jane Smith", username: "jane", imageUrl: "https://via.placeholder.com/150/50E3C2/FFFFFF?text=JS" },
  { id: 3, name: "Alice Johnson", username: "alice", imageUrl: "https://via.placeholder.com/150/F5A623/FFFFFF?text=AJ" },
  { id: 4, name: "Bob Williams", username: "bob", imageUrl: "https://via.placeholder.com/150/D0021B/FFFFFF?text=BW" },
  { id: 5, name: "Emma Brown", username: "emma", imageUrl: "https://via.placeholder.com/150/7ED321/FFFFFF?text=EB" },
  { id: 6, name: "Michael Davis", username: "michael", imageUrl: "https://via.placeholder.com/150/9013FE/FFFFFF?text=MD" },
];

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserDashboard users={users} />} />
        <Route path="/:username" element={<PrescriptionDashboard users={users} />} />
        <Route path="/:username/:prescription" element={<PrescriptionPage users={users} />} />
      </Routes>
    </Router>
  );
};

export default App;