const mongoose = require("mongoose")

const ProfileSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  value: [{
    key: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    }
  }]
})

module.exports = mongoose.model("Profile", ProfileSchema)

