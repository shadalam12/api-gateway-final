import express from 'express';
import { testConnection, sequelize } from './database/connection.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import clientRoutes from './routes/clientRoutes.js';
import envRoutes from './routes/envRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { protectRoute } from './middleware/auth.js';
import { protectClientRoute } from './middleware/clientAuth.js';
import { apiGateway } from './gateway/apiGateway.js'; 
import { rateLimiter } from './middleware/rateLimiter.js';
import { initRateLimiters } from './middleware/rateLimiterService.js';
import { connectDB } from './database/mongo_connection.js';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Test the connection
testConnection();
connectDB();

// Start the server
async function startServer() {
  const gateway = await apiGateway(); // await the async gateway loader
  const rateLimitForService = await initRateLimiters();

  // Route setup
  app.use("/client", clientRoutes); // Client routes          
  app.use("/client/env", protectClientRoute, envRoutes); // Environment routes
  app.use("/client/service", protectClientRoute, serviceRoutes); // Service routes
  app.use("/user", userRoutes); // User routes
  app.use("/", protectRoute, rateLimiter, rateLimitForService,  gateway);  // Apply rate limiting

  await sequelize.sync(); // Ensures DB is ready

  app.listen(port, () => {
    console.log(`Proxy listening at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
