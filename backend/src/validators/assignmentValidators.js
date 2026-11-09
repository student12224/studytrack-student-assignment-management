
import ApiError from "../utils/ApiError.js";

const validPriorities = ["low", "medium", "high"];
const validStatuses = ["pending", "in-progress", "completed"];

const validateFields = (data, isUpdate = false) => {
  const errors = [];

  // Title: required during creation, optional during updates
  if (!isUpdate || data.title !== undefined) {
    if (
      typeof data.title !== "string" ||
      data.title.trim().length < 3 ||
      data.title.trim().length > 120
    ) {
      errors.push("Title must contain between 3 and 120 characters.");
    }
  }

  // Description
  if (data.description !== undefined) {
    if (
      typeof data.description !== "string" ||
      data.description.length > 3000
    ) {
      errors.push("Description cannot exceed 3000 characters.");
    }
  }

  // Subject
  if (data.subject !== undefined) {
    if (
      typeof data.subject !== "string" ||
      data.subject.length > 100
    ) {
      errors.push("Subject cannot exceed 100 characters.");
    }
  }

  // Due date: required during creation, optional during updates
  if (!isUpdate || data.dueDate !== undefined) {
    if (
      typeof data.dueDate !== "string" ||
      data.dueDate.trim() === "" ||
      Number.isNaN(Date.parse(data.dueDate))
    ) {
      errors.push("Please provide a valid due date.");
    }
  }

  // Priority
  if (data.priority !== undefined) {
    if (!validPriorities.includes(data.priority)) {
      errors.push("Priority must be low, medium or high.");
    }
  }

  // Status
  if (data.status !== undefined) {
    if (!validStatuses.includes(data.status)) {
      errors.push("Status must be pending, in-progress or completed.");
    }
  }

  return errors;
};

// Validate new assignment
export const validateAssignment = (req, res, next) => {
  const errors = validateFields(req.body, false);

  if (errors.length > 0) {
    return next(
      new ApiError(400, "Assignment validation failed.", errors)
    );
  }

  next();
};

// Validate partial assignment updates
export const validateAssignmentUpdate = (req, res, next) => {
  const errors = validateFields(req.body, true);

  if (errors.length > 0) {
    return next(
      new ApiError(400, "Assignment validation failed.", errors)
    );
  }

  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "No assignment fields provided."));
  }

  next();
};
