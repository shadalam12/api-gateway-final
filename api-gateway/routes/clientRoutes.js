import express from 'express';
import { registerClient, loginClient, logoutClient } from '../controller/clientController.js';

const router = express.Router();

// Client routes
router.post('/register', registerClient);
router.post('/login', loginClient);
router.post('/logout', logoutClient);

export default router;