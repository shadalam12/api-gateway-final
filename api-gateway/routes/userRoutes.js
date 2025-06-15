import express from 'express';
import { signup, login, logout } from '../controller/userController.js';

const router = express.Router();

// User routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;
