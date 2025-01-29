const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const config = require("./config/config")
const documentRoutes = require("./routes/documentRoutes")
const path = require("path")
const fs = require("fs")

const app = express()

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname,"..","uploads")
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

// Middleware
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(uploadsDir))

// Connect to MongoDB
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err))

// Routes
app.use("/api/documents", documentRoutes)

// Start server
const PORT = config.port || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))