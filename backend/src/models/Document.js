const mongoose = require("mongoose")
const { Schema } = mongoose;

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  redacted_path: {
    type: String,
  },
  redacted_data: {
    type: Schema.Types.Mixed,  // Allows any type of JSON object
    default: {}
  },
  size: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Document", documentSchema)

