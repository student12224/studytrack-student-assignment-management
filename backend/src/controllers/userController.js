import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET: Retrieve the logged-in user's profile
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});

// PUT: Update the logged-in user's profile
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  // Validate the name
  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 80
  ) {
    throw new ApiError(400, "Name must contain between 2 and 80 characters.");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      name: name.trim(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});
