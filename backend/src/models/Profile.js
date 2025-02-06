const mongoose = require("mongoose")

const ProfileSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model("Profile", ProfileSchema)

