import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Edit2, Save, ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';

const PrescriptionPage = () => {
  const { username, prescriptionTitle } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [prescription, setPrescription] = useState({
    doctorName: "Dr. John Doe",
    doctorLicense: "MD12345",
    patientName: "Jane Smith",
    patientAge: "35",
    patientGender: "Female",
    diagnosis: "Common Cold",
    date: "2024-10-18",
    medicines: [
      { id: 1, name: "Acetaminophen", dosage: "500mg", frequency: "Every 6 hours", duration: "5 days" },
      { id: 2, name: "Loratadine", dosage: "10mg", frequency: "Once daily", duration: "7 days" }
    ]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescription(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicineChange = (id, field, value) => {
    setPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.map(med => 
        med.id === id ? { ...med, [field]: value } : med
      )
    }));
  };

  const addMedicine = () => {
    const newMedicine = { id: Date.now(), name: "", dosage: "", frequency: "", duration: "" };
    setPrescription(prev => ({
      ...prev,
      medicines: [...prev.medicines, newMedicine]
    }));
  };

  const deleteMedicine = (id) => {
    setPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.filter(med => med.id !== id)
    }));
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
      <Link to={`/${username}`} className="text-black flex items-center mb-4 hover:text-black">
        <ArrowLeft className="mr-2" /> Back to {username}'s Profile
      </Link>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Prescription: {prescriptionTitle}</h2>
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
            
            {/* Common Details */}
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 mb-8">
              {Object.entries(prescription)
                .filter(([key]) => key !== 'medicines')
                .map(([key, value]) => (
                  <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                    </label>
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
                  </div>
              ))}
            </div>
            
            {/* Medicines */}
            <h3 className="text-lg font-medium text-gray-900 mb-4">Medicines</h3>
            <div className="space-y-4">
              {prescription.medicines.map((medicine) => (
                <div key={medicine.id} className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {['name', 'dosage', 'frequency', 'duration'].map((field) => (
                      <div key={field}>
                        <label htmlFor={`${medicine.id}-${field}`} className="block text-sm font-medium text-gray-700">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type="text"
                          id={`${medicine.id}-${field}`}
                          value={medicine[field]}
                          onChange={(e) => handleMedicineChange(medicine.id, field, e.target.value)}
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
                  {isEditing && (
                    <button
                      onClick={() => deleteMedicine(medicine.id)}
                      className="mt-2 inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <button
                onClick={addMedicine}
                className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Medicine
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;