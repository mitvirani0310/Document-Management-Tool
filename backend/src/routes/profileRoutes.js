const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// Get all profiles
router.get("/", profileController.getAllProfiles);

// Get a single profile
router.get("/:id", profileController.getProfile);

// Create a new profile
router.post("/", profileController.createProfile);

// Update a profile 
router.put("/:id", profileController.updateProfile);

// Delete a profile
router.delete("/:id", profileController.deleteProfile);

module.exports = router;