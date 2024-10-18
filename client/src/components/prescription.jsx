import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Save, ArrowLeft } from 'lucide-react';

const PrescriptionPage = ({users}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prescription, setPrescription] = useState({
    doctorName: "Dr. John Doe",
    doctorLicense: "MD12345",
    patientName: "Jane Smith",
    patientAge: "35",
    patientGender: "Female",
    diagnosis: "Common Cold",
    medication: "Acetaminophen 500mg",
    dosage: "1 tablet every 6 hours",
    duration: "5 days",
    instructions: "Take with food",
    date: "2024-10-18"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescription(prev => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    console.log("Saving prescription:", prescription);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
         <Link to={`/${users}`} className="text-black flex items-center mb-4 hover:text-black">
        <ArrowLeft className="mr-2" /> Back to Users
      </Link>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Prescription</h2>
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
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              {Object.entries(prescription).map(([key, value]) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {key === "instructions" ? (
                    <textarea
                      name={key}
                      id={key}
                      value={value}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      className={`mt-1 block w-full rounded-md shadow-sm 
                      ${isEditing 
                        ? 'focus:ring-indigo-500 focus:border-indigo-500 border-gray-300' 
                        : 'bg-gray-100 border-transparent'
                      } sm:text-sm`}
                    />
                  ) : (
                    <input
                      type="text"
                      name={key}
                      id={key}
                      value={value}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      className={`mt-1 block w-full rounded-md shadow-sm 
                      ${isEditing 
                        ? 'focus:ring-indigo-500 focus:border-indigo-500 border-gray-300' 
                        : 'bg-gray-100 border-transparent'
                      } sm:text-sm`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;
