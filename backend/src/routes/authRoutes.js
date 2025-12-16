// backend/src/routes/authRoutes.js
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Donor from "../models/Donor.js";
import Recipient from "../models/Recipient.js";

const router = Router();
const JWT_SECRET = "your_jwt_secret_key";

/* ----------------------- DONOR REGISTER ----------------------- */
router.post("/register/donor", async (req, res) => {
  try {
    const { name, email, password, bloodType, city } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await Donor.create({
      name,
      email,
      password: hashed,
      bloodType,
      city,
    });

    res.status(201).json({ message: "Donor registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering donor" });
  }
});

/* ----------------------- DONOR LOGIN ----------------------- */
/* DONOR LOGIN */
router.post("/login/donor", async (req, res) => {
  try {
    const { email, password } = req.body;

    const donor = await Donor.findOne({ where: { email } });

    if (!donor) return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, donor.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: donor.id, type: "donor" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      userId: donor.id,
      userType: "donor"
    });

  } catch (error) {
    console.error("Donor login error:", error);
    return res.status(500).json({ message: "Error logging in donor" });
  }
});


/* ----------------------- SEEKER REGISTER ----------------------- */
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

    const hashed = await bcrypt.hash(password, 10);

    await Recipient.create({
      name,
      email,
      password: hashed,
      bloodType,
      hospitalName,
      contactPhone,
      lat: lat || null,
      lng: lng || null,
    });

    res.status(201).json({ message: "Seeker registered" });
  } catch (err) {
    console.error("Seeker register error:", err);
    res.status(500).json({ message: "Error registering seeker" });
  }
});

/* ----------------------- SEEKER LOGIN ----------------------- */
/* SEEKER LOGIN */
router.post("/login/seeker", async (req, res) => {
  try {
    const { email, password } = req.body;

    const seeker = await Recipient.findOne({ where: { email } });

    if (!seeker) return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, seeker.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: seeker.id, type: "seeker" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      userId: seeker.id,
      userType: "seeker"
    });

  } catch (error) {
    console.error("Seeker login error:", error);
    return res.status(500).json({ message: "Error logging in seeker" });
  }
});
export default router;
