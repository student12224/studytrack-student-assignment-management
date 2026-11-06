import express from "express";

import { getProfile, updateProfile } from "../controllers/userController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All user routes require authentication
router.use(protect);

// Get the currently authenticated user's profile
router.get("/me", getProfile);

// Update the currently authenticated user's profile
router.put("/me", updateProfile);

export default router;
