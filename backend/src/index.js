const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/config");
const documentRoutes = require("./routes/documentRoutes");
const path = require("path");
const fs = require("fs");
const app = express();

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

mongoose
  .connect(config.mongoURI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    writeConcern: { w: "majority" },
    retryWrites: true,
    maxPoolSize: 50,
    readPreference: "primary",
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 2000,
    autoIndex: true
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));


app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

app.use("/uploads", express.static(uploadsDir, {
  setHeaders: (res, path) => {
    res.setHeader("Cache-Control", "no-store"); 
  }
}));

app.use("/api/documents", documentRoutes);

const PORT = config.port || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
