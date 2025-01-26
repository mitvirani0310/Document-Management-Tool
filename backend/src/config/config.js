require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/documentAI",
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  }
  
  