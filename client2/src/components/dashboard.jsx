import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, X, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
// import { motion } from "framer-motion";

const UserDashboard = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    breakfastTime: '00:00',
    lunchTime: '00:00',
    dinnerTime: '00:00',
    sleepTime: '00:00',
  });

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const rootUserId = user._id;

  const fetchUsers = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/users', {
        rootUserId,
      });
      const usersArray = Array.isArray(response.data.users)
        ? response.data.users
        : [response.data.users];
      setUsers(usersArray);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedUser = {
        ...newUser,
        breakfastTime: new Date(`1970-01-01T${newUser.breakfastTime}:00Z`),
        lunchTime: new Date(`1970-01-01T${newUser.lunchTime}:00Z`),
        dinnerTime: new Date(`1970-01-01T${newUser.dinnerTime}:00Z`),
        sleepTime: new Date(`1970-01-01T${newUser.sleepTime}:00Z`),
      };

      if (editingUser) {
        await axios.put(
          `http://localhost:3001/api/users/${editingUser._id}`,
          formattedUser
        );
      } else {
        await axios.post('http://localhost:3001/api/users/create', {
          ...formattedUser,
          rootUserId,
        });
      }

      fetchUsers();
      setShowForm(false);
      setEditingUser(null);
      setNewUser({
        name: '',
        breakfastTime: '',
        lunchTime: '',
        dinnerTime: '',
        sleepTime: '',
      });
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user, e) => {
    
    e.stopPropagation();
    setEditingUser(user);
    setNewUser({
      name: user.name,
      breakfastTime: new Date(user.breakfastTime).toISOString().substring(11, 16),
      lunchTime: new Date(user.lunchTime).toISOString().substring(11, 16),
      dinnerTime: new Date(user.dinnerTime).toISOString().substring(11, 16),
      sleepTime: new Date(user.sleepTime).toISOString().substring(11, 16),
    });
    setShowForm(true);
  };

  const handleDelete = async (userId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:3001/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">

    


      <h1 className="text-4xl font-bold mb-8 text-center text-yellow-400">Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((user) => (
          <Link to={`/${user._id}`} key={user._id}>
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 relative">
              <div className="p-4 h-52 flex flex-col justify-between">
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={(e) => handleEdit(user, e)}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(user._id, e)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="h-full flex justify-center items-center">
                  <h2 className="text-2xl font-semibold text-yellow-400 text-center">{user.name}</h2>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingUser(null);
            setNewUser({
              name: '',
              breakfastTime: '',
              lunchTime: '',
              dinnerTime: '',
              sleepTime: '',
            });
          }}
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
            <div className="space-y-2">
              <label className="text-sm text-yellow-400">Breakfast Time (HH:MM)</label>
              <input
                type="time"
                name="breakfastTime"
                placeholder="Breakfast Time"
                value={newUser.breakfastTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-yellow-400">Lunch Time (HH:MM)</label>
              <input
                type="time"
                name="lunchTime"
                placeholder="Lunch Time"
                value={newUser.lunchTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-yellow-400">Dinner Time (HH:MM)</label>
              <input
                type="time"
                name="dinnerTime"
                placeholder="Dinner Time"
                value={newUser.dinnerTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-yellow-400">Sleep Time (HH:MM)</label>
              <input
                type="time"
                name="sleepTime"
                placeholder="Sleep Time"
                value={newUser.sleepTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-gray-900 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            >
              {editingUser ? 'Update User' : 'Add User'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
