import { Router } from "express";
import BloodRequest from "../models/BloodRequest.js";

const router = Router();

/* -------------------------------------------
   CREATE BLOOD REQUEST (Seeker)
-------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { seekerId, seekerName, bloodType, hospitalName, contactPhone, message } = req.body;

    if (!seekerId)
      return res.status(400).json({ message: "seekerId missing" });

    const request = await BloodRequest.create({
      seekerId,
      seekerName,
      donorId: null,
      bloodType,
      hospitalName,
      contactPhone,
      message,
      status: "pending"
    });

    return res.status(201).json({ message: "Request submitted", request });

  } catch (err) {
    console.error("Blood request create error:", err);
    return res.status(500).json({ message: "Failed to submit request" });
  }
});

/* -------------------------------------------
   DONOR DASHBOARD — SHOW ALL PENDING REQUESTS
-------------------------------------------- */
router.get("/donor/:donorId", async (req, res) => {
  try {
    const requests = await BloodRequest.findAll({
      where: { status: "pending" },   // SHOW ALL SEEKER REQUESTS
      order: [["createdAt", "DESC"]]
    });

    return res.json(requests);

  } catch (err) {
    console.error("Get donor requests error:", err);
    return res.status(500).json({ message: "Failed to load requests" });
  }
});

/* -------------------------------------------
   ACCEPT REQUEST
-------------------------------------------- */
router.put("/accept/:id", async (req, res) => {
  try {
    const request = await BloodRequest.findByPk(req.params.id);

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    request.status = "accepted";
    await request.save();

    return res.json({ message: "Request accepted" });

  } catch (err) {
    console.error("Accept request error:", err);
    return res.status(500).json({ message: "Failed to accept request" });
  }
});

/* -------------------------------------------
   REJECT REQUEST
-------------------------------------------- */
router.put("/reject/:id", async (req, res) => {
  try {
    const request = await BloodRequest.findByPk(req.params.id);

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    await request.save();

    return res.json({ message: "Request rejected" });

  } catch (err) {
    console.error("Reject request error:", err);
    return res.status(500).json({ message: "Failed to reject request" });
  }
});

export default router;
