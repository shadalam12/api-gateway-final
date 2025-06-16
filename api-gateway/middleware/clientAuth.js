import jwt from "jsonwebtoken";
import { Client } from "../model/client.js"; 

// Middleware to protect Client routes
export const protectClientRoute = async (req, res, next) => {
  try {
    // Read the token from the cookie
    const token = req.cookies.jwt;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the token is valid
    if (!decoded || !decoded.userId.client_id) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Fetch the client
    const client = await Client.findByPk( decoded.userId.client_id, {
      attributes: { exclude: ['password'] }
    });

    // Check if the client exists
    if (!client) {
      return res.status(404).json({ message: "User not found" });
    }

    // Allow only users with 'client' role
    if (client.role !== "client") {
      return res.status(403).json({ message: "Forbidden - Clients only" });
    }

    // Attach the client to the request
    req.client = client;
    next();
  } catch (error) {
    console.error("Error in protectClientRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
