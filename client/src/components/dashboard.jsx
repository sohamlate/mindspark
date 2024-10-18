import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, PlusCircle, X } from 'lucide-react';

const UserDashboard = ({ users }) => {
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

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-yellow-400">Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((user) => (
          <Link 
            key={user.id} 
            to={`/${user.username}`}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <div className="relative">
              <img
                src={user.imageUrl}
                alt={user.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <User className="h-24 w-24 text-white opacity-75" />
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-yellow-400 text-center">{user.name}</h2>
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

export default UserDashboard;