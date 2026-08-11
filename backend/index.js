require("dotenv").config();
const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const aiRouter = require("./routes/aiRouter");
const documentRouter = require("./routes/documentRouter");


const app = express();

const PORT = process.env.PORT || 5000;

// ========================
// Middleware
// ========================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/api/documents", documentRouter);

// ========================
// Swagger
// ========================

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========================
// Routes
// ========================

app.use("/api/ai", aiRouter);

// ========================
// Health
// ========================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "NexaRAG backend is running",
  });
});

// ========================
// Start server
// ========================

app.listen(PORT, () => {
  console.log(`NexaRAG API running on http://localhost:${PORT}`);

  console.log(`Swagger running on http://localhost:${PORT}/api-docs`);
});
