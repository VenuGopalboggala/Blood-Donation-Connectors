// backend/src/routes/authRoutes.js

import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Donor from "../models/Donor.js";
import Recipient from "../models/Recipient.js";

const router = Router();

/* ---------------------------------------------------
   DONOR REGISTRATION
---------------------------------------------------- */
router.post("/register/donor", async (req, res) => {
  try {
    const { name, email, password, bloodType, city } = req.body;

    if (!name || !email || !password || !bloodType) {
      return res.status(400).json({ message: "Missing donor fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Donor.create({
      name,
      email,
      password: hashedPassword,
      bloodType,
      city,
    });

    res.status(201).json({ message: "Donor registered successfully" });
  } catch (error) {
    console.error("Donor registration error:", error);
    res.status(500).json({ message: "Error registering donor" });
  }
});

/* ---------------------------------------------------
   DONOR LOGIN
---------------------------------------------------- */
router.post("/login/donor", async (req, res) => {
  try {
    const { email, password } = req.body;

    const donor = await Donor.findOne({ where: { email } });
    if (!donor) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!donor.password) {
      return res.status(500).json({ message: "Donor account missing password." });
    }

    const isValid = await bcrypt.compare(password, donor.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   const token = jwt.sign(
  { id: donor.id, type: "donor" },
  "your_jwt_secret_key",
  { expiresIn: "1h" }
);

res.json({ 
  token,
  isProfileComplete: donor.isProfileComplete
});


    res.json({ token });
  } catch (error) {
    console.error("Donor login error:", error);
    res.status(500).json({ message: "Error logging in donor" });
  }
});

/* ---------------------------------------------------
   SEEKER REGISTRATION
---------------------------------------------------- */
router.post("/register/seeker", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      bloodType,
      hospitalName,
      contactPhone,
      lat,
      lng,
    } = req.body;

    if (!name || !email || !password || !bloodType) {
      return res.status(400).json({ message: "Missing seeker fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Recipient.create({
      name,
      email,
      password: hashedPassword,
      bloodType,
      hospitalName,
      contactPhone,
      lat: lat && lat !== "" ? lat : null,   // ⭐ FIXED
      lng: lng && lng !== "" ? lng : null,   // ⭐ FIXED
    });

    res.status(201).json({ message: "Seeker registered successfully" });
  } catch (error) {
    console.error("Seeker registration error:", error);
    res.status(500).json({ message: "Error registering seeker" });
  }
});


/* ---------------------------------------------------
   SEEKER LOGIN
---------------------------------------------------- */
router.post("/login/seeker", async (req, res) => {
  try {
    const { email, password } = req.body;

    const seeker = await Recipient.findOne({ where: { email } });
    if (!seeker) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, seeker.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: seeker.id, type: "seeker" },
      "your_jwt_secret_key",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Seeker login error:", error);
    res.status(500).json({ message: "Error logging in seeker" });
  }
});

/* ---------------------------------------------------
   EXPORT ROUTER
---------------------------------------------------- */
export default router;
