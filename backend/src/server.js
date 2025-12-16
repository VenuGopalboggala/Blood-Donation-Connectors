// backend/src/server.js
import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";

// ROUTE IMPORTS (ALL DEFAULT EXPORTS — FIXED)
import donorRoutes from "./routes/donorRoutes.js";
import recipientRoutes from "./routes/recipientRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bloodRequestRoutes from "./routes/bloodRequestRoutes.js";
import donorOfferRoutes from "./routes/donorOfferRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// MOUNT ROUTES (ORDER DOES NOT MATTER)
app.use("/api/donors", donorRoutes);
app.use("/api/recipients", recipientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blood-request", bloodRequestRoutes);
app.use("/api/donor-offer", donorOfferRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL");

    await sequelize.sync();
    console.log("📦 Models synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Unable to start server:", err);
  }
};

startServer();
