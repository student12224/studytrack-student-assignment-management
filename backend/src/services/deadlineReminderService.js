import Assignment from "../models/Assignment.js";
import Notification from "../models/Notification.js";

const TIME_ZONE = "Asia/Kolkata";

const getIndiaDateInfo = (date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    dateKey: `${values.year}-${values.month}-${values.day}`,
  };
};

// Converts an Indian calendar date's midnight to UTC.
const getIndiaMidnightUTC = (year, month, day) => {
  return new Date(Date.UTC(year, month - 1, day) - 330 * 60 * 1000);
};

const createDeadlineReminders = async () => {
  const now = new Date();
  const today = getIndiaDateInfo(now);

  const startOfToday = getIndiaMidnightUTC(today.year, today.month, today.day);

  const startOfTomorrow = getIndiaMidnightUTC(
    today.year,
    today.month,
    today.day + 1,
  );

  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Assignments due at any time today.
  const dueToday = await Assignment.find({
    status: { $ne: "completed" },
    dueDate: {
      $gte: startOfToday,
      $lt: startOfTomorrow,
    },
  });

  // Assignments with a future deadline within 24 hours.
  const upcoming = await Assignment.find({
    status: { $ne: "completed" },
    dueDate: {
      $gt: now,
      $lte: next24Hours,
    },
  });

  const createNotification = async (assignment, reminderKey, message) => {
    await Notification.updateOne(
      { reminderKey },
      {
        $setOnInsert: {
          user: assignment.user,
          assignment: assignment._id,
          title: "Deadline approaching",
          message,
          type: "deadline",
          read: false,
          reminderKey,
        },
      },
      { upsert: true },
    );
  };

  for (const assignment of dueToday) {
    const reminderKey = `deadline-today-${assignment._id}-${today.dateKey}`;

    await createNotification(
      assignment,
      reminderKey,
      `"${assignment.title}" is due today. Please complete it before the deadline.`,
    );
  }

  for (const assignment of upcoming) {
    const reminderKey = `deadline-24h-${assignment._id}`;

    await createNotification(
      assignment,
      reminderKey,
      `"${assignment.title}" is due within the next 24 hours.`,
    );
  }

  console.log(
    `Deadline check completed. Due today: ${dueToday.length}, upcoming: ${upcoming.length}.`,
  );
};

export default createDeadlineReminders;
