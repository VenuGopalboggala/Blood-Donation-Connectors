import express from "express";
import jwt from "jsonwebtoken";
import Donation from "../models/Donation.js";

const router = express.Router();

// Middleware to verify donor
const verifyDonor = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, "your_jwt_secret_key");

    if (decoded.type !== "donor")
      return res.status(403).json({ message: "Not authorized" });

    req.donorId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// GET donations for this donor
router.get("/", verifyDonor, async (req, res) => {
  try {
    const history = await Donation.findAll({
      where: { donorId: req.donorId },
      order: [["donationDate", "DESC"]],
    });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching donation history" });
  }
});

// ADD a donation entry
router.post("/add", verifyDonor, async (req, res) => {
  try {
    const { recipientName, bloodType, notes } = req.body;

    await Donation.create({
      donorId: req.donorId,
      recipientName,
      bloodType,
      notes,
    });

    res.json({ message: "Donation recorded successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding donation" });
  }
});

export default router;
