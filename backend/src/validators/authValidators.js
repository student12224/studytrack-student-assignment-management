import ApiError from "../utils/ApiError.js";

export const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  const errors = [];

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 80
  ) {
    errors.push("Name must contain between 2 and 80 characters.");
  }

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    errors.push("Please provide a valid email address.");
  }

  if (
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 72
  ) {
    errors.push("Password must contain between 8 and 72 characters.");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Registration validation failed.", errors));
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof password !== "string" ||
    password.length === 0
  ) {
    return next(
      new ApiError(400, "Please provide a valid email and password."),
    );
  }

  next();
};
