const { ChatGroq } = require("@langchain/groq");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const Prescription = require('../models/Prescription');
const Medication = require('../models/Medication');

require('dotenv').config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama3-70b-8192',
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful medical assistant. Return 2 short, numbered health tips for an Indian adult taking the given medicine, formatted in simple HTML using <ul> and <li>, and include a relevant emoji at the beginning of each tip to make it engaging (like 💧 for hydration, 🕒 for timing, 🍽️ for food-related, etc.). Do not include greetings or introductions. Be concise and clear."],

]);


exports.getUserHealthTips = async (req, res) => {
  try {
    const { userId } = req.params;

    const prescriptions = await Prescription.find({ userId });
    const ids = prescriptions.map(p => p._id);

    const meds = await Medication.find({ prescriptionId: { $in: ids } });
    const uniqueNames = [...new Set(meds.map(m => m.name).filter(Boolean))];

    if (uniqueNames.length === 0) {
      return res.json({ tips: "No medications found for this user." });
    }

    const combinedMedicines = uniqueNames.join(', ');
    const prompt = await promptTemplate.format({ medicineList: combinedMedicines });
    const response = await model.invoke(prompt);

    res.json({ tips: response.content });
  } catch (error) {
    console.error("LLM Tip Error:", error);
    res.status(500).json({ message: "Failed to generate tips." });
  }
};
