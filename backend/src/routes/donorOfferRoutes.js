// backend/src/routes/donorOfferRoutes.js
import { Router } from "express";
import DonorOffer from "../models/DonorOffer.js";
import Donor from "../models/Donor.js";

const router = Router();

/* -------------------------------------------
   CREATE DONOR OFFER
-------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { donorId, location, availabilityDate, message } = req.body;

    // Basic validation
    if (!donorId || !location) {
      return res
        .status(400)
        .json({ message: "donorId and location are required" });
    }

    // Make sure donor exists
    const donor = await Donor.findByPk(donorId);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    const offer = await DonorOffer.create({
      donorId,
      donorName: donor.name,
      location,
      availabilityDate: availabilityDate || "Anytime", // default so DB NOT NULL is happy
      message: message || null,
    });

    return res.status(201).json({ message: "Offer submitted", offer });
  } catch (err) {
    console.error("Offer error:", err);
    return res.status(500).json({ message: "Failed to submit offer" });
  }
});

/* -------------------------------------------
   GET ALL DONOR OFFERS
-------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const offers = await DonorOffer.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(offers);
  } catch (err) {
    console.error("Get offers error:", err);
    res.status(500).json({ message: "Failed to load offers" });
  }
});

export default router;
