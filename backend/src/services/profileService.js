const Profile = require("../models/Profile");

exports.getAllProfiles = async () => {
  return await Profile.find();
};

exports.getProfile = async (id) => {
  return await Profile.findById(id);
};

exports.createProfile = async (label, value) => {
  const newProfile = new Profile({
    label,
    value
  });
  return await newProfile.save();
};

exports.updateProfile = async (id, label, value) => {
  return await Profile.findByIdAndUpdate(
    id,
    { 
      label,
      value
    },
    { new: true }
  );
};

exports.deleteProfile = async (id) => {
  return await Profile.findByIdAndDelete(id);
};