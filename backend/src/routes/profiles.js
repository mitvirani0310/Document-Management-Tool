const express = require("express")
const router = express.Router()
const Profile = require("../models/Profile")

// Get all profiles
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find()
    res.json(profiles)
  } catch (error) {
    console.error("Error fetching profiles:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single profile
router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }
    res.json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new profile
router.post("/", async (req, res) => {
    try {
      const { label, value } = req.body;
      const newProfile = new Profile({
        label,
        value: value.toString() // Ensure value is stored as string
      });
      const savedProfile = await newProfile.save();
      res.status(201).json(savedProfile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// Update a profile
router.put("/:id", async (req, res) => {
    try {
      const { label, value } = req.body;
      const updatedProfile = await Profile.findByIdAndUpdate(
        req.params.id, 
        { 
          label,
          value: value.toString() // Ensure value is stored as string
        }, 
        { new: true }
      );
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

// Delete a profile
router.delete("/:id", async (req, res) => {
  try {
    const deletedProfile = await Profile.findByIdAndDelete(req.params.id)
    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found" })
    }
    res.json({ message: "Profile deleted successfully" })
  } catch (error) {
    console.error("Error deleting profile:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router;

