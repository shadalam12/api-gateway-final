import express from 'express';
import { createEnvironment, getAllEnvironments } from '../controller/envController.js';

const router = express.Router();

// Environment routes
router.post('/addenv', createEnvironment);
router.post('/getenv', getAllEnvironments);

export default router;