import express from 'express';
import { createService, getAllServices } from '../controller/serviceController.js';


const router = express.Router();

// Service routes
router.post('/addservice', createService);
router.post('/getservice', getAllServices);

export default router;