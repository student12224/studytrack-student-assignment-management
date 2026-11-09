import Assignment from "../models/Assignment.js";
import ApiError from "../utils/ApiError.js";

export const createAssignment = async (userId, assignmentData) => {
  const assignment = await Assignment.create({
    ...assignmentData,
    user: userId,
  });

  return assignment;
};

export const getAssignments = async (userId, filters = {}) => {
  const query = {
    user: userId,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.priority) {
    query.priority = filters.priority;
  }

  if (filters.subject) {
    query.subject = {
      $regex: filters.subject,
      $options: "i",
    };
  }

  const assignments = await Assignment.find(query).sort({
    dueDate: 1,
    createdAt: -1,
  });

  return assignments;
};

export const getAssignmentById = async (userId, assignmentId) => {
  const assignment = await Assignment.findOne({
    _id: assignmentId,
    user: userId,
  });

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  return assignment;
};

export const updateAssignment = async (userId, assignmentId, updateData) => {
  const allowedFields = [
    "title",
    "description",
    "subject",
    "dueDate",
    "priority",
    "status",
  ];

  const filteredData = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  }

  const assignment = await Assignment.findOne({
    _id: assignmentId,
    user: userId,
  });

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  Object.assign(assignment, filteredData);

  await assignment.save();

  return assignment;
};
export const deleteAssignment = async (userId, assignmentId) => {
  const assignment = await Assignment.findOneAndDelete({
    _id: assignmentId,
    user: userId,
  });

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  return assignment;
};
