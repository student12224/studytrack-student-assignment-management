import express from "express";

import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// Retrieve all notifications belonging to the logged-in user
router.get("/", getNotifications);

// Mark a specific notification as read
router.patch("/:id/read", markNotificationAsRead);

export default router;
