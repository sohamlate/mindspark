const axios = require('axios');
const { ChatGroq } = require("@langchain/groq");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const AWS = require('aws-sdk');
const Prescription = require('../models/Prescription');
const Medication = require('../models/Medication');

require('dotenv').config();



const textract = new AWS.Textract({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama3-70b-8192',
});

const outputParser = new StringOutputParser();
const template = `Extract the following details from the prescription and return it in valid JSON format.
Rules:
1. Return ONLY the JSON object, no additional text
2. Ensure the JSON is properly formatted


Prescription: {prescriptionText}


Return the data in this exact format (replace with actual values):
{{
  "doctorName": "Dr. John Doe",
  "doctorLicense": "MD12345",
  "patientName": "Jane Smith",
  "patientAge": 35,
  "patientGender": "Female",
  "diagnosis": "Common Cold",
  "date": "2024-10-18",
  "medicines": [
    {{
      "name": "Acetaminophen",
      "dosage": "500mg",
      "frequency": "Every 6 hours",
      "duration": "5 days"
    }},
    {{
      "name": "Loratadine",
      "dosage": "10mg",
      "frequency": "Once daily",
      "duration": "7 days"
    }}
  ]
}}`;

const promptTemplate = ChatPromptTemplate.fromTemplate(template);

function cleanJsonString(str) {
  const jsonStart = str.indexOf('{');
  const jsonEnd = str.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('No valid JSON object found in response');
  }
  return str.slice(jsonStart, jsonEnd + 1);
}

// Function to analyze image using AWS Textract
async function analyzeImage(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    const detectParameter = {
      Document: { Bytes: Buffer.from(response.data) },
      FeatureTypes: ['FORMS'],
    };

    return new Promise((resolve, reject) => {
      textract.analyzeDocument(detectParameter, (err, data) => {
        if (err) return reject(err);

        const textBlocks = data.Blocks
          .filter((block) => block.BlockType === 'WORD' && block.Text)
          .map((block) => block.Text);

        resolve(textBlocks.join(' '));
      });
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

// Function to process prescription text using the model
async function processPrescription(prescriptionText) {
  try {
    const chain = promptTemplate.pipe(model).pipe(outputParser);
    console.log('Sending request to model...');
    const result = await chain.invoke({ prescriptionText });

    console.log('Raw response from model:', result);

    const cleanedResult = cleanJsonString(result);
    const parsedJson = JSON.parse(cleanedResult);

    if (!parsedJson.medicines || !Array.isArray(parsedJson.medicines)) {
      throw new Error("Invalid JSON structure: 'medicines' array is required");
    }

    return parsedJson;
  } catch (error) {
    console.error('Error processing prescription:', error);
    throw error;
  }
}

function parseDosage(defaultDosage, timing, frequency) {
    // Extract specific dosage for timing if available (e.g., "Morning, 1/2 Night")
    const regex = new RegExp(`${timing}\\s*(\\d+\\/\\d+|\\d+)?`);
    const match = frequency.match(regex);
  
  
    if (match && match[1]) {
      const dosageParts = match[1].split('/');
      if (dosageParts.length === 2) {
        // Handle fractional dosage (e.g., "1/2")
        return parseFloat(dosageParts[0]) / parseFloat(dosageParts[1]);
      }
      return parseFloat(match[1]);
    }
  
  
    // Fallback to default dosage if no specific timing is provided
    return parseFloat(defaultDosage);
  }
  

// Function to save medications to the database
async function saveMedications(prescriptionData, userId, prescriptionId) {
  try {
    const medicines = prescriptionData.medicines;

    if (!Array.isArray(medicines)) {
      throw new Error('Medicines should be an array');
    }

    for (const medicine of medicines) {
      const dosage = { morning: 0, afternoon: 0, evening: 0, night: 0 };

      if (medicine.frequency) {
        if (medicine.frequency.includes('Morning')) {
          dosage.morning = parseDosage(medicine.dosage, 'Morning', medicine.frequency);
        }
        if (medicine.frequency.includes('Aft')) {
          dosage.afternoon = parseDosage(medicine.dosage, 'Aft', medicine.frequency);
        }
        if (medicine.frequency.includes('Eve')) {
          dosage.evening = parseDosage(medicine.dosage, 'Eve', medicine.frequency);
        }
        if (medicine.frequency.includes('Night')) {
          dosage.night = parseDosage(medicine.dosage, 'Night', medicine.frequency);
        }
      }

      const newMedication = new Medication({
        name: medicine.name,
        dosage,
        timing: medicine.duration.includes('Before Food') ? 'Before Food' : 'After Food',
        duration: medicine.duration.split(' ')[0],
        userId,
        prescriptionId,
      });

      await newMedication.save();
      console.log('Medication saved:', newMedication);
    }

    return { message: 'All medications saved successfully' };
  } catch (error) {
    console.error('Error saving medications:', error.message);
    throw new Error('Failed to save medications');
  }
}

async function fetchAndAnalyzeImage(req, res) {
  const { imageUrl } = req.body;

  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing imageUrl' });
  }

  try {
    const prescriptionText = await analyzeImage(imageUrl);
    const prescriptionData = await processPrescription(prescriptionText);
   
    const newPrescription = new Prescription(prescriptionData);
    const newMedicine = await saveMedications(prescriptionData, newPrescription.userId, newPrescription._id);
 
    const savedPrescription = await newPrescription.save();

    res.status(200).json({
      message: 'Prescription extracted and saved successfully',
      data: savedPrescription,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error processing prescription', details: err.message });
  }
}

module.exports = { fetchAndAnalyzeImage };
