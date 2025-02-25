import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Pencil, 
  Trash2, 
  PlusCircle, 
  ArrowLeft, 
  User, 
  X, 
  Save,
  Clock,
  Calendar,
  Bell,
  Shield,
  Pill,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { storage } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';

const PrescriptionDashboard = () => {
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [newPrescription, setNewPrescription] = useState({ title: '', imageUrl: '' });
  const [file, setFile] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchPrescriptions();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await axios.post(
        `https://prescriptprob.vercel.app/api/users/getUser`,
        { userId }
      );
      setUser({ name: response.data.users.name, imageUrl: response.data.users.imageUrl });
    } catch (error) {
      setError('Error fetching user');
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: <Pill />, label: "Active Prescriptions", value: prescriptions.length },
    { icon: <CheckCircle />, label: "Completed", value: "12" },
    { icon: <AlertCircle />, label: "Expiring Soon", value: "3" },
    { icon: <Activity />, label: "Adherence Rate", value: "95%" }
  ];

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(`https://prescriptprob.vercel.app/api/users/p/${userId}/prescriptions`);
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !newPrescription.title.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const storageRef = ref(storage, `prescriptions/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Error uploading image:', error);
          setLoading(false);
          alert('Error uploading image. Please try again.');
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const medications = await axios.post(
              'https://prescriptprob.vercel.app/api/extractimg/fetchimage',
              { imageUrl: downloadURL }
            );

            const response = await axios.post(
              `https://prescriptprob.vercel.app/api/users/p/${userId}/newPrescription`,
              {
                title: newPrescription.title,
                imageUrl: downloadURL,
                ...medications.data.data,
              }
            );

            setPrescriptions((prev) => [...prev, response.data]);
            setNewPrescription({ title: '', imageUrl: '' });
            setFile(null);
            setShowAddForm(false);
          } catch (error) {
            console.error('Error adding prescription:', error);
            alert('Error adding prescription. Please try again.');
          } finally {
            setLoading(false);
          }
        }
      );
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      alert('An error occurred. Please try again.');
    }
  };

  const handleDelete = async (e, _id) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        setLoading(true);
        await axios.delete(`https://prescriptprob.vercel.app/api/users/${userId}/prescriptions/${_id}`);
        setPrescriptions((prev) => prev.filter((prescription) => prescription._id !== _id));
      } catch (error) {
        console.error('Error deleting prescription:', error);
        alert('Error deleting prescription. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (e, _id, currentTitle) => {
    e.preventDefault();
    e.stopPropagation();
    setEditMode(_id);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = async (e, _id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!editTitle.trim()) {
      alert('Title cannot be empty');
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `https://prescriptprob.vercel.app/api/users/${userId}/prescriptions/${_id}`,
        { title: editTitle }
      );
      
      setPrescriptions((prevPrescriptions) =>
        prevPrescriptions.map((prescription) =>
          prescription._id === _id 
            ? { ...prescription, title: editTitle }
            : prescription
        )
      );
      
      setEditMode(null);
      setEditTitle('');
    } catch (error) {
      console.error('Error updating prescription:', error);
      alert('Error updating prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="flex items-center justify-center">
          <div className="text-yellow-400 text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="text-yellow-400 text-xl text-center">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/dashboard" className="text-emerald-400 flex items-center mb-8 hover:text-emerald-300 transition-colors duration-300">
          <ArrowLeft className="mr-2" /> Back to Users
        </Link>
      </motion.div>
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-24 h-24 mr-4">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <User className="h-12 w-12 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {user.name}'s Prescriptions
          </h1>
        </div>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Manage and track all prescriptions in one secure place
        </p>
      </motion.div>

      {/* Statistics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((stat, index) => (
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

      {/* Prescriptions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-emerald-400">Active Prescriptions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {prescriptions.map((prescription, index) => (
            <motion.div
              key={prescription._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105 border border-slate-700/50 hover:border-emerald-500/50"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  {editMode === prescription._id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-slate-900/50 text-emerald-400 px-4 py-2 rounded-lg border border-slate-700/50 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors duration-300 w-2/3"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-emerald-400">
                      {prescription.title}
                    </h2>
                  )}
                  <div className="flex space-x-2">
                    {editMode === prescription._id ? (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleSaveEdit(e, prescription._id)}
                        className="bg-emerald-500/20 text-emerald-400 p-2 rounded-full hover:bg-emerald-500/30 transition-colors duration-300"
                      >
                        <Save className="h-5 w-5" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleEdit(e, prescription._id, prescription.title)}
                        className="bg-emerald-500/20 text-emerald-400 p-2 rounded-full hover:bg-emerald-500/30 transition-colors duration-300"
                      >
                        <Pencil className="h-5 w-5" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleDelete(e, prescription._id)}
                      className="bg-red-500/20 text-red-400 p-2 rounded-full hover:bg-red-500/30 transition-colors duration-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
                <Link to={`/${userId}/prescriptions/${prescription._id}`}>
                  <div className="relative group">
                    <img
                      src={prescription.imageUrl}
                      alt={prescription.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors duration-300 rounded-lg" />
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="fixed bottom-8 right-8"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-500 text-white rounded-full p-4 shadow-lg hover:bg-emerald-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
        >
          {showAddForm ? <X className="h-8 w-8" /> : <PlusCircle className="h-8 w-8" />}
        </motion.button>
      </motion.div>

      {/* Add Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700/50 p-8 shadow-lg"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-emerald-400 mb-6">Add New Prescription</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={newPrescription.title}
                onChange={handleInputChange}
                placeholder="Prescription Title"
                className="w-full px-4 py-2 bg-slate-900/50 text-white rounded-lg border border-slate-700/50 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors duration-300"
                required
              />
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 bg-slate-900/50 text-white rounded-lg border border-slate-700/50 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors duration-300"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Prescription'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PrescriptionDashboard;