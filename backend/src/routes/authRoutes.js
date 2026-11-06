import { Router } from "express";

import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

import {
  validateRegistration,
  validateLogin,
} from "../validators/authValidators.js";

const router = Router();

router.post("/register", authLimiter, validateRegistration, register);

router.post("/login", authLimiter, validateLogin, login);

router.post("/logout", protect, logout);

router.get("/me", protect, getMe);

export default router;
