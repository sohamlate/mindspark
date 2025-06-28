import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, X, Edit2, Trash2, Users, Clock, 
  FileText, CalendarCheck, UserCheck, BarChart3 
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    prescriptionCount: 0,
    medicationCount: 0,
    eventTodayCount: 0,
    familyMemberCount: 0
  });

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    breakfastTime: '00:00',
    lunchTime: '00:00',
    dinnerTime: '00:00',
    sleepTime: '00:00',
  });

  const rootUserId = user._id;

  useEffect(() => {
    if (!rootUserId) return;
    fetchUsers();
    fetchStats();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await axios.post('https://prescriptprob.vercel.app/api/users', {
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

  const fetchStats = async () => {
    try {
      const response = await axios.post('https://prescriptprob.vercel.app/api/dashboard/stats', {
        rootUserId,
      });
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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
        await axios.put(`https://prescriptprob.vercel.app/api/users/${editingUser._id}`, formattedUser);
      } else {
        await axios.post('https://prescriptprob.vercel.app/api/users/create', {
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

  const handleEdit = (userObj, e) => {
    e.stopPropagation();
    setEditingUser(userObj);
    setNewUser({
      name: userObj.name,
      breakfastTime: new Date(userObj.breakfastTime).toISOString().substring(11, 16),
      lunchTime: new Date(userObj.lunchTime).toISOString().substring(11, 16),
      dinnerTime: new Date(userObj.dinnerTime).toISOString().substring(11, 16),
      sleepTime: new Date(userObj.sleepTime).toISOString().substring(11, 16),
    });
    setShowForm(true);
  };

  const handleDelete = async (userId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`https://prescriptprob.vercel.app/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Welcome to Your Dashboard
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Manage your family's medication schedules and track their health progress all in one place.
        </p>
      </motion.div>

      {/* Real Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {[
          { icon: <UserCheck className="w-6 h-6" />, label: "Family Members", value: dashboardStats.familyMemberCount },
          { icon: <FileText className="w-6 h-6" />, label: "Prescriptions", value: dashboardStats.prescriptionCount },
          { icon: <BarChart3 className="w-6 h-6" />, label: "Medications", value: dashboardStats.medicationCount },
          { icon: <CalendarCheck className="w-6 h-6" />, label: "Today's Events", value: dashboardStats.eventTodayCount },
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-semibold text-emerald-400">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Users Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
        <h2 className="text-3xl font-bold mb-8 text-center text-emerald-400">Manage Family Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => navigate(`/${user._id}`)}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105 relative border border-slate-700/50 hover:border-emerald-500/50"
            >
              <div className="p-6 h-52 flex flex-col justify-between">
                <div className="absolute top-4 right-4 flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleEdit(user, e)}
                    className="bg-emerald-500/20 text-emerald-400 p-2 rounded-full hover:bg-emerald-500/30 transition-colors duration-300"
                  >
                    <Edit2 size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleDelete(user._id, e)}
                    className="bg-red-500/20 text-red-400 p-2 rounded-full hover:bg-red-500/30 transition-colors duration-300"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
                <div className="h-full flex flex-col justify-center items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-emerald-400 text-center">{user.name}</h2>
                  <div className="flex gap-2 text-slate-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(user.breakfastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add User Button */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="fixed bottom-8 right-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(!showForm);
            setEditingUser(null);
            setNewUser({ name: '', breakfastTime: '', lunchTime: '', dinnerTime: '', sleepTime: '' });
          }}
          className="bg-emerald-500 text-white rounded-full p-4 shadow-lg hover:bg-emerald-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
        >
          {showForm ? <X className="h-8 w-8" /> : <PlusCircle className="h-8 w-8" />}
        </motion.button>
      </motion.div>

      {/* Add/Edit User Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-20 right-8 w-80 bg-slate-800/95 backdrop-blur-sm text-white rounded-lg shadow-lg p-6 border border-slate-700/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Name" value={newUser.name} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900/50 text-white rounded-lg border border-slate-700/50 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors duration-300" />
            {['breakfast', 'lunch', 'dinner', 'sleep'].map((meal) => (
              <div key={meal} className="space-y-2">
                <label className="text-sm text-emerald-400 capitalize">{meal} Time (HH:MM)</label>
                <input type="time" name={`${meal}Time`} value={newUser[`${meal}Time`]} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900/50 text-white rounded-lg border border-slate-700/50 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors duration-300" />
              </div>
            ))}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
              {editingUser ? 'Update User' : 'Add User'}
            </motion.button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default UserDashboard;
