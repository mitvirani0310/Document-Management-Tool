const Profile = require("../models/Profile");

exports.getAllProfiles = async () => {
  return await Profile.find();
};

exports.getProfile = async (id) => {
  return await Profile.findById(id);
};

exports.getProfileByLabel = async (label) => {
    return await Profile.findOne({ label: label });
  };

// exports.createProfile = async (label, value) => {
//   const newProfile = new Profile({
//     label,
//     value
//   });
//   return await newProfile.save();
// };

exports.createProfile = async (label, value) => {
    // Check if profile with same label already exists
    const existingProfile = await Profile.findOne({ label: label });
    if (existingProfile) {
      throw new Error('Profile with this name already exists');
    }
  
    const newProfile = new Profile({
      label,
      value
    });
    return await newProfile.save();
  };

// exports.updateProfile = async (id, label, value) => {
//   return await Profile.findByIdAndUpdate(
//     id,
//     { 
//       label,
//       value
//     },
//     { new: true }
//   );
// };

exports.updateProfile = async (id, label, value) => {
    // Check if another profile with same label exists (excluding current profile)
    const existingProfile = await Profile.findOne({ 
      label: label,
      _id: { $ne: id } // Exclude current profile from check
    });
    
    if (existingProfile) {
      throw new Error('Profile with this name already exists');
    }
  
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