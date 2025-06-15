import express from 'express';
import { testConnection, sequelize } from './database/connection.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import clientRoutes from './routes/clientRoutes.js';
import envRoutes from './routes/envRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { protectRoute } from './middleware/auth.js';
import { apiGateway } from './gateway/apiGateway.js'; // renamed to match the async factory
import { rateLimiter } from './middleware/rateLimiter.js';
import { initRateLimiters } from './middleware/rateLimiterService.js';
import { connectDB } from './database/mongo_connection.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

testConnection();
connectDB();

async function startServer() {
  const gateway = await apiGateway(); // await the async gateway loader
  const rateLimitForService = await initRateLimiters();

  // Route setup
  app.use("/client", clientRoutes);           // fixed typo: added leading slash
  app.use("/env", protectRoute, envRoutes);
  app.use("/service", protectRoute, serviceRoutes);
  app.use("/user", userRoutes);
  app.use("/", protectRoute, rateLimiter, rateLimitForService,  gateway); // ✅ now a proper middleware

  await sequelize.sync(); // Ensures DB is ready

  app.listen(port, () => {
    console.log(`Proxy listening at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
