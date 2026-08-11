const express = require("express");
const multer = require("multer");

const { authenticateToken } = require("../middleware/authMiddleware");

const { requireAdmin } = require("../middleware/roleMiddleware");
const {
  uploadDocument,
  getAllDocuments,
  removeDocument,
} = require("../controllers/documentController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/**
 * @swagger
 * tags:
 *   - name: Documents
 *     description: Document management APIs
 */

/**
 * @swagger
 * /api/documents/upload:
 *   post:
 *     summary: Upload and process a PDF
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: PDF processed successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.post(
  "/upload",
  authenticateToken,
  requireAdmin,
  upload.single("file"),
  uploadDocument,
);
/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get all uploaded documents
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/",
  authenticateToken,
  getAllDocuments
);
/**
 * @swagger
 * /api/documents/{documentId}:
 *   delete:
 *     summary: Delete a document
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.delete(
  "/:documentId",
  authenticateToken,
  requireAdmin,
  removeDocument
);
module.exports = router;
