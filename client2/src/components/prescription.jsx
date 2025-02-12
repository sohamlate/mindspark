import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Edit2, Save, ArrowLeft, PlusCircle, Trash2, Calendar } from 'lucide-react';
import axios from 'axios';



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

  const gapi = window.gapi;
  const google = window.google;

  const CLIENT_ID = "61276085040-6dm8n01r77896386u8oqgcash36aau6u.apps.googleusercontent.com";
  const API_KEY = "AIzaSyD8SqLazVgfFR-2UevjdtN2lklmLtl4Ad4";
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
  }
  
  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken("");
      localStorage.clear();
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
      const response = await axios.get(`http://localhost:3001/api/users/p/${userId}/prescriptions`);
      const response2 = await axios.get(`http://localhost:3001/api/medicines/${prescriptionId}`);
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
          await axios.put(`http://localhost:3001/api/users/p/${prescriptionId}`, prescription);
          await axios.put(`http://localhost:3001/api/medicines/${prescriptionId}`, { medicines: prescriptionmed });
          setIsEditing(false);
        } catch (error) {
          console.error('Error saving prescription:', error);
        }
      };
      
      const generateScedule = async () => {
        try {
          const response = await axios.post(`http://localhost:3001/api/event/generateScedule`, { userId, prescriptionId });
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
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Link to={`/${userId}`} className="text-black flex items-center mb-4 hover:text-black">
        <ArrowLeft className="mr-2" /> Back to User's Profile
      </Link>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Prescription Details</h2>
              <button
                onClick={isEditing ? handleSave : toggleEdit}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </>
                )}
              </button>
            </div>
            
            {/* Prescription Details */}
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 mb-8">
              {['doctorName', 'doctorLicense', 'patientName', 'patientAge', 'patientGender', 'diagnosis'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type={field === 'date' ? 'date' : 'text'}
                    name={field}
                    id={field}
                    value={prescription[field] || '-'}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`mt-1 block w-full rounded-md shadow-sm 
                      ${isEditing 
                        ? 'focus:ring-indigo-500 focus:border-indigo-500 border-gray-300' 
                        : 'bg-gray-100 border-transparent'
                      } sm:text-sm`}
                      />
                </div>
              ))}
            </div>
            
            {/* Medicines */}
            <h3 className="text-lg font-medium text-gray-900 mb-4">Medicines</h3>
            <div className="space-y-4">
              {prescriptionmed.map((medicine, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                    <div>
                      <label htmlFor={`medicine-name-${index}`} className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        id={`medicine-name-${index}`}
                        value={medicine.name}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        readOnly={!isEditing}
                        className={`mt-1 block w-full rounded-md shadow-sm ${isEditing ? 'border-gray-300' : 'bg-gray-100 border-transparent'} sm:text-sm`}
                      />
                    </div>
                    <div>
                      <label htmlFor={`medicine-timing-${index}`} className="block text-sm font-medium text-gray-700">Timing</label>
                      <input
                        type="text"
                        id={`medicine-timing-${index}`}
                        value={medicine.timing}
                        onChange={(e) => handleMedicineChange(index, 'timing', e.target.value)}
                        readOnly={!isEditing}
                        className={`mt-1 block w-full rounded-md shadow-sm ${isEditing ? 'border-gray-300' : 'bg-gray-100 border-transparent'} sm:text-sm`}
                      />
                    </div>
                    <div>
                      <label htmlFor={`medicine-duration-${index}`} className="block text-sm font-medium text-gray-700">Duration</label>
                      <input
                        type="text"
                        id={`medicine-duration-${index}`}
                        value={medicine.duration}
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        readOnly={!isEditing}
                        className={`mt-1 block w-full rounded-md shadow-sm ${isEditing ? 'border-gray-300' : 'bg-gray-100 border-transparent'} sm:text-sm`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                    {['morning', 'afternoon', 'evening', 'night'].map((time) => (
                      <div key={time}>
                        <label htmlFor={`medicine-dosage-${index}-${time}`} className="block text-sm font-medium text-gray-700">{time.charAt(0).toUpperCase() + time.slice(1)}</label>
                        <input
                          type="number"
                          step="0.1"
                          id={`medicine-dosage-${index}-${time}`}
                          value={medicine.dosage[time]}
                          onChange={(e) => handleDosageChange(index, time, e.target.value)}
                          readOnly={!isEditing}
                          className={`mt-1 block w-full rounded-md shadow-sm ${isEditing ? 'border-gray-300' : 'bg-gray-100 border-transparent'} sm:text-sm`}
                        />
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => deleteMedicine(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={addMedicine}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Add Medicine
              </button>
            )}
            {/* Google Calendar Button */}
             <div className='flex gap-x-2'>

              <button
                id="authorize_button"
                onClick={handleAuthClick}
                hidden={accessToken && expiresIn}
                className={`mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  accessToken && expiresIn ? "hidden" : ""
                }`}
              >
              Select Google Account
              </button>
              <button
                id="signout_button"
                onClick={handleSignoutClick}
                className={ `mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
    !accessToken && !expiresIn ? "hidden" : ""
  }`}
              >
                Remove Google Account
              </button>
              <button
                id="add_manual_event"
                onClick={generateScedule}
                hidden={!accessToken && !expiresIn}
                className={`mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
    !accessToken && !expiresIn ? "hidden" : ""
  }`}
              >
                <Calendar className="h-4 w-4 mr-2" /> Create Event in Google Calendar
              </button>
              {/* <pre id="content" style={{ whiteSpace: "pre-wrap" }}></pre>  */}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;


