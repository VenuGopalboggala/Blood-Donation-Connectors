import { Router } from "express";
import Request from "../models/Request.js"; // model you create below

const router = Router();

// Create a blood request
router.post("/", async (req, res) => {
  try {
    const { seekerId, bloodType, message } = req.body;

    if (!seekerId || !bloodType) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newReq = await Request.create({
      seekerId,
      bloodType,
      message
    });

    res.status(201).json({ message: "Request submitted", data: newReq });
  } catch (err) {
    console.error("Request error:", err);
    res.status(500).json({ message: "Error submitting request" });
  }
});

export default router;
