import express from "express";
import {
  validateAssignment,
  validateAssignmentUpdate
} from "../validators/assignmentValidators.js";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";

import protect from "../middleware/authMiddleware.js";

import { validateAssignment } from "../validators/assignmentValidators.js";

const router = express.Router();

// All assignment routes require authentication
router.use(protect);

// Create assignment
router.post("/", validateAssignment, createAssignment);

// Retrieve all assignments
router.get("/", getAssignments);
router.post("/", protect, validateAssignment, createAssignment);

router.put("/:id", protect, validateAssignmentUpdate, updateAssignment);
// Retrieve one assignment
router.get("/:id", getAssignmentById);

// Update assignment
router.put("/:id", validateAssignment, updateAssignment);

// Delete assignment
router.delete("/:id", deleteAssignment);

export default router;
