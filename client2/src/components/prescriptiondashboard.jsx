import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Pencil, Trash2, PlusCircle, ArrowLeft, User, X, Save
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
  const [llmTips, setLlmTips] = useState(null);
const [activeCount, setActiveCount] = useState(0);
const [passiveCount, setPassiveCount] = useState(0);

  const [prescriptionStatuses, setPrescriptionStatuses] = useState({});

  useEffect(() => {
    fetchUser();
    fetchPrescriptions();
    fetchLLMTips();
    fetchPrescriptionStatuses();
  }, [userId]);

const fetchPrescriptionStatuses = async () => {
  try {
    const res = await axios.get(`http://localhost:3001/api/users/p/${userId}/prescriptionStatus`);
    console.log("abcd", res);
    const statusMap = {};
    let active = 0, passive = 0;
    res.data.statuses.forEach(item => {
      statusMap[item._id] = item.isActive;
      if (item.isActive) active += 1;
      else passive += 1;
    });
    setPrescriptionStatuses(statusMap);
    setActiveCount(active);
    setPassiveCount(passive);
  } catch (error) {
    console.error("Error fetching prescription statuses", error);
  }
};


  const fetchUser = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/users/getUser', { userId });
      setUser({ name: response.data.users.name, imageUrl: response.data.users.imageUrl });
    } catch (error) {
      setError('Error fetching user');
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLLMTips = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/user-tips/${userId}`);
       // Extract all `kwargs.content` strings from the response
      // const allTips = res.data.tips.map(item => item.tips.kwargs.content);
      
      // // Combine all tips into a single string (optional: join with line breaks or bullets)
      // const combinedTips = allTips.join('\n\n');
      // console.log(res , "cdscds vd");
      
      setLlmTips(res.data.tips);
      console.log(res,"fds vdsf vds");
    } catch (err) {
      console.error("Error fetching LLM tips", err);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/users/p/${userId}/prescriptions`);
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
            const medications = await axios.post('http://localhost:3001/api/extractimg/fetchimage', {
              imageUrl: downloadURL,
            });

            const response = await axios.post(
              `http://localhost:3001/api/users/p/${userId}/newPrescription`,
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
        await axios.delete(`http://localhost:3001/api/users/${userId}/prescriptions/${_id}`);
        setPrescriptions((prev) => prev.filter((p) => p._id !== _id));
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
      await axios.put(`http://localhost:3001/api/users/p/${_id}`, {
        title: editTitle,
      });

      setPrescriptions((prev) =>
        prev.map((p) => (p._id === _id ? { ...p, title: editTitle } : p))
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
      <div className="min-h-screen bg-gray-900 p-8 text-yellow-400 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 text-yellow-400 text-center">
        User not found
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
        <Link to="/dashboard" className="text-emerald-400 flex items-center mb-8 hover:text-emerald-300">
          <ArrowLeft className="mr-2" /> Back to Home
        </Link>
      </motion.div>

     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-xl mx-auto mb-12 p-6 rounded-2xl border border-emerald-500/30 bg-emerald-400/5 backdrop-blur-md shadow-lg"
    >
      <h2 className="text-2xl font-bold text-slate-300 flex items-center justify-center mb-4">
        💊 Health Tips for Your Medications
      </h2>

      {llmTips ? (
        <div
          className="
            prose 
            prose-invert 
            prose-p:text-slate-200 
            prose-li:text-slate-200 
            prose-headings:text-emerald-400 
            text-left 
            text-lg 
            leading-relaxed 
            space-y-2
            text-slate-300
          "
          dangerouslySetInnerHTML={{ __html: llmTips }}
        />
      ) : (
        <p className="text-slate-300 text-center">No health tips available.</p>
      )}
    </motion.div>

    <div className="flex justify-center gap-4 mb-12">
  <button
    className="
      flex items-center gap-2 
      bg-emerald-500/20 
      hover:bg-emerald-500/30 
      text-emerald-300 
      font-semibold 
      px-4 py-2 
      rounded-lg 
      border border-emerald-500/30 
      transition
    "
  >
    Active Prescriptions
    <span className="bg-emerald-600 text-white rounded-full px-2 py-0.5 text-sm">{activeCount}</span>
  </button>
  <button
    className="
      flex items-center gap-2 
      bg-slate-600/20 
      hover:bg-slate-600/30 
      text-slate-300 
      font-semibold 
      px-4 py-2 
      rounded-lg 
      border border-slate-500/30 
      transition
    "
  >
    Passive Prescriptions
    <span className="bg-slate-500 text-white rounded-full px-2 py-0.5 text-sm">{passiveCount}</span>
  </button>
</div>



      {/* Prescriptions Grid */}
      {/* Prescriptions Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {prescriptions
  .slice()
  .sort((a, b) => {
    const aActive = prescriptionStatuses[a._id] ? 1 : 0;
    const bActive = prescriptionStatuses[b._id] ? 1 : 0;
    return bActive - aActive; // active (1) first
  }).map((prescription, index) => {
    const isActive = prescriptionStatuses[prescription._id];

    return (
      <motion.div
        key={prescription._id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className={`
        rounded-xl
        hover:scale-105
        transition-all duration-300
        shadow-lg
        ${isActive 
          ? 'bg-slate-800 border  border-emerald-500/50 hover:border-emerald-400' 
          : 'bg-slate-700 border border-slate-600/50 hover:border-slate-500'}
      `}

      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            {editMode === prescription._id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-2/3 px-4 py-2 text-emerald-400 bg-slate-900/50 border border-slate-700/50 rounded-lg focus:ring-emerald-500 focus:outline-none"
              />
            ) : (
              <h2 className="text-xl font-semibold text-emerald-400">{prescription.title}</h2>
            )}
            <div className="flex space-x-2">
              {editMode === prescription._id ? (
                <motion.button
                  onClick={(e) => handleSaveEdit(e, prescription._id)}
                  className="p-2 bg-emerald-500/20 rounded-full hover:bg-emerald-500/30 text-emerald-400"
                >
                  <Save className="h-5 w-5" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={(e) => handleEdit(e, prescription._id, prescription.title)}
                  className="p-2 bg-emerald-500/20 rounded-full hover:bg-emerald-500/30 text-emerald-400"
                >
                  <Pencil className="h-5 w-5" />
                </motion.button>
              )}
              <motion.button
                onClick={(e) => handleDelete(e, prescription._id)}
                className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/30 text-red-400"
              >
                <Trash2 className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
          <Link to={`/${userId}/prescriptions/${prescription._id}`}>
            <img
              src={prescription.imageUrl}
              alt={prescription.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </Link>
        </div>
      </motion.div>
    );
  })}
</div>


   {/* Floating Add Button */}
    <div className="fixed bottom-8 right-8 z-50">
      <motion.button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-emerald-500 text-white rounded-full p-4 shadow-lg hover:bg-emerald-600 transition"
      >
        {showAddForm ? <X className="h-8 w-8" /> : <PlusCircle className="h-8 w-8" />}
      </motion.button>
    </div>


      {/* Add Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-slate-800/95 p-8 border-t border-slate-700/50"
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
                className="w-full px-4 py-2 bg-slate-900/50 text-white rounded-lg border border-slate-700/50"
                required
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2 bg-slate-900/50 text-white rounded-lg border border-slate-700/50"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition"
              >
                {loading ? 'Saving...' : 'Save Prescription'}
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PrescriptionDashboard;
