import ApiError from "../utils/ApiError.js";

const validPriorities = ["low", "medium", "high"];

const validStatuses = ["pending", "in-progress", "completed"];

export const validateAssignment = (req, res, next) => {
  const {
    title,
    description = "",
    subject = "",
    dueDate,
    priority = "medium",
    status = "pending",
  } = req.body;

  const errors = [];

  if (
    typeof title !== "string" ||
    title.trim().length < 3 ||
    title.trim().length > 120
  ) {
    errors.push("Title must contain between 3 and 120 characters.");
  }

  if (typeof description !== "string" || description.length > 3000) {
    errors.push("Description cannot exceed 3000 characters.");
  }

  if (typeof subject !== "string" || subject.length > 100) {
    errors.push("Subject cannot exceed 100 characters.");
  }

  if (typeof dueDate !== "string" || Number.isNaN(Date.parse(dueDate))) {
    errors.push("Please provide a valid due date.");
  }

  if (!validPriorities.includes(priority)) {
    errors.push("Priority must be low, medium or high.");
  }

  if (!validStatuses.includes(status)) {
    errors.push("Status must be pending, in-progress or completed.");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Assignment validation failed.", errors));
  }

  next();
};
