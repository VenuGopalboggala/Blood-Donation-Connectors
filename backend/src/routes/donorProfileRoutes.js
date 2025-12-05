import express from "express";
import Donor from "../models/Donor.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// MIDDLEWARE: Check token
const verifyDonor = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, "your_jwt_secret_key");

    if (decoded.type !== "donor") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    req.donorId = decoded.id;
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// UPDATE DONOR PROFILE
router.put("/update", verifyDonor, async (req, res) => {
  try {
    const { bloodType, city, isAvailable, lat, lng } = req.body;

    await Donor.update(
      {
        bloodType,
        city,
        isAvailable,
        lat,
        lng,
        isProfileComplete: true,
      },
      { where: { id: req.donorId } }
    );

    res.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Profile update failed" });
  }
});

export default router;
