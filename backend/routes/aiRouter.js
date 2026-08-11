const express = require("express");

const { chatWithAI } = require("../controllers/aiController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: NexaRAG AI APIs
 */

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Ask NexaRAG a question
 *     tags:
 *       - AI
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 example: How many sick leave days do employees get?
 *
 *     responses:
 *       200:
 *         description: AI answer generated successfully
 *
 *       400:
 *         description: Question is required
 *
 *       500:
 *         description: AI service error
 */
router.post("/chat", chatWithAI);

module.exports = router;
