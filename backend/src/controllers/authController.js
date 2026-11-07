import * as authService from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cookieName = process.env.COOKIE_NAME || "studytrack_token";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
});
export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);

  res.cookie(cookieName, token, getCookieOptions());

  res.status(201).json({
    success: true,
    message: "Account registered successfully.",
    data: { user },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);

  res.cookie(cookieName, token, getCookieOptions());

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: { user },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});
