import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Edit2, 
  Save, 
  ArrowLeft, 
  PlusCircle, 
  Trash2, 
  Calendar,
  Clock,
  Pill,
  AlertCircle,
  Shield,
  Activity,
  Bot,
  Stethoscope,
  User,
  CalendarClock
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';




export const PrescriptionPage = () => {

  const { userId, prescriptionId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [prescriptionmed, setPrescriptionmed] = useState([]);
  const [prescription, setPrescription] = useState({
    doctorName: "Mr. Prajwal",
    doctorLicense: "Maharashtra Medical Council",
    patientName: "Pratik patil",
    patientAge: 24,
    patientGender: "Male",
    diagnosis: "Fever",
    date: "21-10-2024",
  });

  // Add new stats section data
  const stats = [
    { 
      icon: <Clock className="w-6 h-6" />, 
      label: "Duration", 
      value: prescriptionmed[0]?.duration || "N/A" 
    },
    { 
      icon: <Pill className="w-6 h-6" />, 
      label: "Medicines", 
      value: prescriptionmed.length 
    },
    { 
      icon: <Activity className="w-6 h-6" />, 
      label: "Daily Doses", 
      value: prescriptionmed.reduce((acc, med) => 
        acc + Object.values(med.dosage).reduce((sum, dose) => sum + (dose || 0), 0), 0
      )
    },
    { 
      icon: <CalendarClock className="w-6 h-6" />, 
      label: "Next Dose", 
      value: "2 hours" 
    }
  ];

  const gapi = window.gapi;
  const google = window.google;

  // console.log("rrs ", process.env.REACT_APP_SS);

  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const API_KEY = process.env.REACT_APP_API_KEY;
  const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
  const SCOPES = "https://www.googleapis.com/auth/calendar";

  const accessToken = localStorage.getItem("access_token");
  const expiresIn = localStorage.getItem("expires_in");

  
  let gapiInited = false,
  gisInited = false,
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    DISCOVERY_DOC: "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    callback: "",
    error_callback: handleAuthError,
  });
  
  useEffect(() => {
    fetchPrescription();
    gapiLoaded();
    gisLoaded();
  }, []);
  
  function gapiLoaded() {
    gapi.load("client", initializeGapiClient);
  }
  
  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    }).then(() => {
      console.log("gapi client initialized");
    });
    gapiInited = true;
    
    if (accessToken && expiresIn) {
      gapi.client.setToken({
        access_token: accessToken,
        expires_in: expiresIn,
      });
      listUpcomingEvents();
    }

    console.log("gapi is initiliased");
  }

  function handleAuthError(error) {
    console.error("Authentication failed:", error);
    alert("Authentication failed. Please try again.");
    // You can also redirect to an error page or retry the authentication
  }
  
  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      DISCOVERY_DOC: "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      callback: "",
    });
    gisInited = true;
  }

  tokenClient.callback = async (resp) => {
    if (resp.error) {
      console.log("errr", resp.error);
      throw resp;
    }
    console.log("Callback triggered");
    await listUpcomingEvents();
    const tokenData = gapi.client.getToken();
    console.log("Token data:", tokenData);
    
    if (tokenData) {
      const { access_token, expires_in } = tokenData;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("expires_in", expires_in);
    }
    
    console.log("ram ram"); // Check if it gets here
  };
  
  function handleAuthClick() {
    console.log("calling handle " , tokenClient);
    tokenClient.callback = async (resp) => {
      if (resp.error) {
        console.log("errr", resp.error);
        throw resp;
      }
      console.log("Callback triggered");
      await listUpcomingEvents();
      const tokenData = gapi.client.getToken();
      console.log("Token data:", tokenData);
      
      if (tokenData) {
        const { access_token, expires_in } = tokenData;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("expires_in", expires_in);
      }
      
      console.log("ram ram"); // Check if it gets here
    };
    console.log("final printing ", accessToken, expiresIn, tokenClient);
    
    if (!(accessToken && expiresIn)) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      tokenClient.requestAccessToken({ prompt: "" });
    }
    window.location.reload();
  }
  
  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken("");
      localStorage.removeItem("access_token");
      localStorage.removeItem("expires_in");
      window.location.reload();
    }
  }
  
  async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      console.log(err.message);
      // document.getElementById("content").innerText = err.message;
      return;
    }
    
    const events = response.result.items;
    if (!events || events.length === 0) {
      
      return;
    }
    
    const output = events.reduce(
      (str, event) =>
        `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
      "Events:\n"
    );
   
  } 
  
  function addManualEvent(eventData , index) {
    console.log("priting access ", eventData.summary, " " , eventData.start.dateTime);
    const eventDate = new Date(eventData.start.dateTime);
const hours = eventDate.getHours();
console.log(hours , "sdad dsad");
    var event = {
      summary: `Prescription for ${eventData.summary} -  ${prescription.patientName} - Event ${index + 1}`,
      location: 'Doctor’s Office',
      description: eventData.description || prescription.diagnosis,
      start: {
        dateTime: eventData.start.dateTime,
        timeZone: eventData.start.timeZone || 'Asia/Kolkata',
      },
      end: {
        dateTime: eventData.end.dateTime,
        timeZone: eventData.end.timeZone || 'Asia/Kolkata',
      },
      recurrence: [
        `RRULE:FREQ=${eventData.recurrence.freq};COUNT=${eventData.recurrence.count}`,
      ],
      reminders: { useDefault: true },
    };
    
    var request = gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
      sendUpdates: "all",
    });
    
    request.execute(
      (event) => {
        console.log(event);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  const fetchPrescription = async () => {
    try {
      const response = await axios.get(`https://prescriptprob.vercel.app/api/users/p/${userId}/prescriptions`);
      const response2 = await axios.get(`https://prescriptprob.vercel.app/api/medicines/${prescriptionId}`);
      console.log(response2.data,"guruji");
      setPrescriptionmed(response2.data);
      setPrescription(response.data.filter(prescription => prescription._id == prescriptionId)[0]);
    } catch (error) {
      console.error('Error fetching prescription:', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescription(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMedicineChange = (index, field, value) => {
    setPrescriptionmed(prevPrescriptionmed =>
      prevPrescriptionmed.map((medicine, i) =>
        i === index ? { ...medicine, [field]: value } : medicine
  )
);
};

const handleDosageChange = (index, time, value) => {
  setPrescriptionmed(prevPrescriptionmed =>
    prevPrescriptionmed.map((medicine, i) =>
      i === index
  ? {
              ...medicine,
              dosage: {
                ...medicine.dosage,
                [time]: parseFloat(value),
              },
            }
            : medicine
          )
        );
      };
      
      const addMedicine = () => {
        const newMedicine = { name: "", dosage: { morning: 0, afternoon: 0, evening: 0, night: 0 }, timing: "", duration: "" };
        setPrescriptionmed(prevPrescriptionmed => [...prevPrescriptionmed, newMedicine]);
      };
      
      const deleteMedicine = (index) => {
        setPrescriptionmed(prevPrescriptionmed => prevPrescriptionmed.filter((medicine, i) => i !== index));
      };
      
      const toggleEdit = () => {
        setIsEditing(!isEditing);
      };
      
      const handleSave = async () => {
        try {
          await axios.put(`https://prescriptprob.vercel.app/api/users/p/${prescriptionId}`, prescription);
          await axios.put(`https://prescriptprob.vercel.app/api/medicines/${prescriptionId}`, { medicines: prescriptionmed });
          setIsEditing(false);
        } catch (error) {
          console.error('Error saving prescription:', error);
        }
      };
      
      const generateScedule = async () => {
        try {
          const response = await axios.post(`https://prescriptprob.vercel.app/api/event/generateScedule`, { userId, prescriptionId });
          const events = response.data.eventDocument.events;
          console.log(events , "priting events")


          // console.log("priting acces", accessToken , expiresIn);
          
          // Loop through each event and create it in Google Calendar
          events.forEach((eventData, index) => {
            addManualEvent(eventData, index);
          });
        } catch (error) {
          console.error("Error generating schedule:", error.message);
        }
      };
      
      console.log("priting acces",  prescriptionmed);
      
      return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to={`/${userId}`} 
              className="text-emerald-400 flex items-center mb-8 hover:text-emerald-300 transition-colors duration-300"
            >
              <ArrowLeft className="mr-2" /> Back to User's Profile
            </Link>
          </motion.div>
    
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Prescription Details
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Manage and track your medication details with precision
              </p>
            </motion.div>
    
            {/* Stats Grid */}
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
    
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                      <Stethoscope className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-400">Medical Information</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isEditing ? handleSave : toggleEdit}
                    className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-300"
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Details
                      </>
                    )}
                  </motion.button>
                </div>
    
                {/* Patient Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <User className="h-5 w-5 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-emerald-300">Patient Information</h3>
                    </div>
                    <div className="space-y-4">
                      {['patientName', 'patientAge', 'patientGender'].map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-slate-400 mb-1">
                            {field.replace('patient', '').charAt(0).toUpperCase() + field.replace('patient', '').slice(1)}
                          </label>
                          <input
                            type={field === 'patientAge' ? 'number' : 'text'}
                            name={field}
                            value={prescription[field] || ''}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            className={`w-full px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 border ${
                              isEditing 
                                ? 'border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50' 
                                : 'border-slate-700/50'
                            } transition-colors duration-300`}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
    
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Bot className="h-5 w-5 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-emerald-300">Doctor Information</h3>
                    </div>
                    <div className="space-y-4">
                      {['doctorName', 'doctorLicense', 'diagnosis'].map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-slate-400 mb-1">
                            {field.replace('doctor', '').charAt(0).toUpperCase() + field.replace('doctor', '').slice(1)}
                          </label>
                          <input
                            type="text"
                            name={field}
                            value={prescription[field] || ''}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            className={`w-full px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 border ${
                              isEditing 
                                ? 'border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50' 
                                : 'border-slate-700/50'
                            } transition-colors duration-300`}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
    
                {/* Medicines Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Pill className="h-5 w-5 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-emerald-300">Prescribed Medicines</h3>
                    </div>
                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addMedicine}
                        className="inline-flex items-center px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors duration-300"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Medicine
                      </motion.button>
                    )}
                  </div>
    
                  <div className="space-y-6">
                    {prescriptionmed.map((medicine, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                            <input
                              type="text"
                              value={medicine.name}
                              onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                              readOnly={!isEditing}
                              className={`w-full px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 border ${
                                isEditing 
                                  ? 'border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50' 
                                  : 'border-slate-700/50'
                              } transition-colors duration-300`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Timing</label>
                            <input
                              type="text"
                              value={medicine.timing}
                              onChange={(e) => handleMedicineChange(index, 'timing', e.target.value)}
                              readOnly={!isEditing}
                              className={`w-full px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 border ${
                                isEditing 
                                  ? 'border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50' 
                                  : 'border-slate-700/50'
                              } transition-colors duration-300`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Duration</label>
                            <input
                              type="text"
                              value={medicine.duration}
                              onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                              readOnly={!isEditing}
                              className={`w-full px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 border ${
                                isEditing 
                                  ? 'border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50' 
                                  : 'border-slate-700/50'
                              } transition-colors duration-300`}
                            />
                          </div>
                          {isEditing && (
                            <div className="flex items-end">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => deleteMedicine(index)}
                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                              >
                                <Trash2 className="h-5 w-5" />
                              </motion.button>
                            </div>
                          )}
                        </div>
    
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                          {['morning', 'afternoon', 'evening', 'night'].map((time) => (
                            <div key={time}>
                              <label className="block text-sm font-medium text-slate-400 mb-1">
                                {time.charAt(0).toUpperCase() + time.slice(1)}
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={medicine.dosage[time]}
                                onChange={(e) => handleDosageChange(index, time, e.target.value)}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 border ${
                                  isEditing 
                                    ? 'border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50' 
                                    : 'border-slate-700/50'
                                } transition-colors duration-300`}
                              />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
    
                {/* Google Calendar Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mt-12 bg-slate-900/50 p-6 rounded-xl border border-slate-700/50"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-300">Calendar Integration</h3>
                  </div>
    
                  <div className="flex flex-wrap gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAuthClick}
                      hidden={accessToken && expiresIn}
                      className={`inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-300 ${
                        accessToken && expiresIn ? "hidden" : ""
                      }`}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Select Google Account
                    </motion.button>
    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSignoutClick}
                      className={`inline-flex items-center px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-300 ${
                        !accessToken && !expiresIn ? "hidden" : ""
                      }`}
                    >
                      Remove Google Account
                    </motion.button>
    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateScedule}
                      hidden={!accessToken && !expiresIn}
                      className={`inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-300 ${
                        !accessToken && !expiresIn ? "hidden" : ""
                      }`}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Create Calendar Events
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      );
    };
    
    export default PrescriptionPage;

