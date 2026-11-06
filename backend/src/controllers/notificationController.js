import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    user: req.user.id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      notifications,
    },
  });
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user.id,
    },
    {
      $set: { read: true },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found.");
  }

  res.status(200).json({
    success: true,
    message: "Notification marked as read.",
    data: {
      notification,
    },
  });
});
