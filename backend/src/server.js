import express from 'express';
import sequelize from './config/db.js';

import donorRoutes from './routes/donorRoutes.js';
import recipientRoutes from './routes/recipientRoutes.js';
import authRoutes from './routes/authRoutes.js';
import featuresRoutes from './routes/featuresRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import donorProfileRoutes from './routes/donorProfileRoutes.js';

import cors from 'cors';

const app = express();   // ✅ MUST COME FIRST
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

/* ------------------------
    ROUTES
------------------------ */
app.use('/api/donors', donorRoutes);
app.use('/api/recipients', recipientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/features', featuresRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/donor/profile', donorProfileRoutes);

/* ------------------------
    START SERVER
------------------------ */
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');

    await sequelize.sync({ alter: true });
    console.log('📦 Models synchronized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database error:', error);
  }
};

startServer();
