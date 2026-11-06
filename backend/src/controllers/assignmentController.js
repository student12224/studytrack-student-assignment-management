import * as assignmentService from "../services/assignmentService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new assignment
export const createAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.createAssignment(
    req.user.id,
    req.body,
  );

  res.status(201).json({
    success: true,
    message: "Assignment created successfully.",
    data: assignment,
  });
});

// Retrieve all assignments
export const getAssignments = asyncHandler(async (req, res) => {
  const assignments = await assignmentService.getAssignments(
    req.user.id,
    req.query,
  );

  res.status(200).json({
    success: true,
    count: assignments.length,
    data: assignments,
  });
});

// Retrieve a single assignment by ID
export const getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.getAssignmentById(
    req.user.id,
    req.params.id,
  );

  res.status(200).json({
    success: true,
    data: assignment,
  });
});

// Update an assignment
export const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.updateAssignment(
    req.user.id,
    req.params.id,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Assignment updated successfully.",
    data: assignment,
  });
});

// Delete an assignment
export const deleteAssignment = asyncHandler(async (req, res) => {
  await assignmentService.deleteAssignment(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Assignment deleted successfully.",
  });
});
