const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const askAI = async (question) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/chat`,
      {
        question,
      },
      {
        timeout: 120000,
      },
    );

    return response.data;
  } catch (error) {
    console.error("AI Service Error:", error.response?.data || error.message);

    throw new Error(
      error.response?.data?.message || "AI service is unavailable",
    );
  }
};

module.exports = {
  askAI,
};
