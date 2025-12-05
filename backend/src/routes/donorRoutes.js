import express from "express";
import Donor from "../models/Donor.js";

const router = express.Router();

// GET all donors
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.findAll();
    res.json(donors);
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).json({ message: "Error fetching donors" });
  }
});

// CREATE a new donor
router.post("/", async (req, res) => {
  try {
    const { name, email, bloodType, city } = req.body;

    // Validate fields
    if (!name || !email || !bloodType) {
      return res.status(400).json({ message: "Name, email, and blood type are required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === "") {
      return res.status(400).json({ message: "Email cannot be empty." });
    }

    // Check if email already exists
    const existing = await Donor.findOne({ where: { email: cleanEmail } });

    if (existing) {
      return res.status(400).json({ message: "Email already used." });
    }

    // Create donor
    const donor = await Donor.create({
      name,
      email: cleanEmail,
      bloodType,
      city: city || ""
    });

    res.status(201).json(donor);

  } catch (error) {
    console.error("Error creating donor:", error);
    res.status(500).json({ message: "Error creating donor" });
  }
});

// DELETE donor
router.delete("/:id", async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    await donor.destroy();
    res.json({ message: "Donor deleted successfully" });
  } catch (error) {
    console.error("Error deleting donor:", error);
    res.status(500).json({ message: "Error deleting donor" });
  }
  router.get("/", async (req, res) => {
  const donors = await Donor.findAll({
    where: {
      isAvailable: true,
      isProfileComplete: true
    }
  });

  res.json(donors);
});

});

export default router;
