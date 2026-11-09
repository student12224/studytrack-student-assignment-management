
import express from "express";

import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";

import protect from "../middleware/authMiddleware.js";

import {
  validateAssignment,
  validateAssignmentUpdate,
} from "../validators/assignmentValidators.js";

const router = express.Router();

// All assignment routes require authentication
router.use(protect);

// Create a new assignment
router.post("/", validateAssignment, createAssignment);

// Retrieve all assignments
router.get("/", getAssignments);

// Retrieve a single assignment
router.get("/:id", getAssignmentById);

// Update an existing assignment
router.put("/:id", validateAssignmentUpdate, updateAssignment);

// Delete an assignment
router.delete("/:id", deleteAssignment);

export default router;
