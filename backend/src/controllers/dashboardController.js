import Assignment from "../models/Assignment.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const now = new Date();

  const [
    totalAssignments,
    completedAssignments,
    pendingAssignments,
    inProgressAssignments,
    overdueAssignments,
    upcomingAssignments,
    unreadNotifications,
    recentAssignments,
  ] = await Promise.all([
    Assignment.countDocuments({ user: userId }),

    Assignment.countDocuments({
      user: userId,
      status: "completed",
    }),

    Assignment.countDocuments({
      user: userId,
      status: "pending",
    }),

    Assignment.countDocuments({
      user: userId,
      status: "in-progress",
    }),

    Assignment.countDocuments({
      user: userId,
      status: { $ne: "completed" },
      dueDate: { $lt: now },
    }),

    Assignment.find({
      user: userId,
      status: { $ne: "completed" },
      dueDate: { $gte: now },
    })
      .sort({ dueDate: 1 })
      .limit(5),

    Notification.countDocuments({
      user: userId,
      isRead: false,
    }),

    Assignment.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
  ]);

  const completionRate =
    totalAssignments === 0
      ? 0
      : Math.round((completedAssignments / totalAssignments) * 100);

  res.status(200).json({
    success: true,
    data: {
      statistics: {
        totalAssignments,
        completedAssignments,
        pendingAssignments,
        inProgressAssignments,
        overdueAssignments,
        unreadNotifications,
        completionRate,
      },
      upcomingAssignments,
      recentAssignments,
    },
  });
});
