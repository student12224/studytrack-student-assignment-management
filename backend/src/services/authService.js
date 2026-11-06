import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

// Generate JWT authentication token
const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    algorithm: "HS256",
  });
};

// Return safe user information without password
const sanitiseUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// Register a new user
export const registerUser = async ({ name, email, password }) => {
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new ApiError(400, "Please provide valid registration details.");
  }

  const normalisedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalisedEmail,
  });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalisedEmail,
    passwordHash,
    isActive: true,
    role: "student",
  });

  const token = createToken(user._id);

  return {
    user: sanitiseUser(user),
    token,
  };
};

// Authenticate an existing user
export const loginUser = async ({ email, password }) => {
  if (typeof email !== "string" || typeof password !== "string") {
    throw new ApiError(400, "Please provide email and password.");
  }

  const normalisedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalisedEmail,
  }).select("+passwordHash");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (user.isActive === false) {
    throw new ApiError(403, "Your account is inactive.");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = createToken(user._id);

  return {
    user: sanitiseUser(user),
    token,
  };
};

// Retrieve the authenticated user's details
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.isActive === false) {
    throw new ApiError(403, "Your account is inactive.");
  }

  return sanitiseUser(user);
};
