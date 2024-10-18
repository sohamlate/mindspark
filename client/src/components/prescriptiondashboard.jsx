import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle, ArrowLeft, User , X} from 'lucide-react';
import { useState } from 'react';
const prescriptions = [
  {
    id: 1,
    title: "Amoxicillin",
    imageUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Amoxicillin",
  },
  {
    id: 2,
    title: "Lisinopril",
    imageUrl: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Lisinopril",
  },
  {
    id: 3,
    title: "Metformin",
    imageUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Metformin",
  },
  {
    id: 4,
    title: "Simvastatin",
    imageUrl: "https://via.placeholder.com/150/FFFF00/000000?text=Simvastatin",
  },
  {
    id: 5,
    title: "Omeprazole",
    imageUrl: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=Omeprazole",
  },
  {
    id: 6,
    title: "Levothyroxine",
    imageUrl: "https://via.placeholder.com/150/00FFFF/000000?text=Levothyroxine",
  },
];

const PrescriptionDashboard = ({ users }) => {
  const { username } = useParams();
  const user = users.find(u => u.username === username);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', imageUrl: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission,
    // such as sending the data to an API
    console.log('New user:', newUser);
    setShowForm(false);
    setNewUser({ name: '', username: '', imageUrl: '' });
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-900 p-8 text-yellow-400 text-center">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link to="/" className="text-yellow-400 flex items-center mb-4 hover:text-yellow-300">
        <ArrowLeft className="mr-2" /> Back to Users
      </Link>
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-24 h-24 mr-4">
          <img
            src={user.imageUrl}
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-white opacity-75" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-yellow-400">
          {user.name}'s Prescriptions
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {prescriptions.map((prescription) => (
          <Link to={'/users/prescription'} key={prescription.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
            <div className="relative">
              <img
                src={prescription.imageUrl}
                alt={prescription.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button className="bg-yellow-400 p-2 rounded-full text-gray-800 hover:bg-yellow-300 transition-colors duration-300">
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="bg-red-500 p-2 rounded-full text-white hover:bg-red-400 transition-colors duration-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-yellow-400 text-center">{prescription.title}</h2>
            </div>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-yellow-400 text-gray-900 rounded-full p-4 shadow-lg hover:bg-yellow-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
        >
          {showForm ? <X className="h-8 w-8" /> : <PlusCircle className="h-8 w-8" />}
        </button>
      </div>
      {showForm && (
        <div className="fixed bottom-20 right-8 w-64 bg-gray-800 text-white rounded-lg shadow-lg p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={newUser.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={newUser.imageUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button 
              type="submit" 
              className="w-full bg-yellow-400 text-gray-900 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            >
              Add User
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PrescriptionDashboard;