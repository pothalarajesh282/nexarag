const { askAI } = require("../services/aiService");

const chatWithAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const result = await askAI(question.trim());

    return res.status(200).json(result);
  } catch (error) {
    console.error("AI Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  chatWithAI,
};
