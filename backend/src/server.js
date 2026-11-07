import "dotenv/config";
import app from "./app.js";
import connectDatabase from "./config/database.js";
import createDeadlineReminders from "./services/deadlineReminderService.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    await createDeadlineReminders();

    setInterval(
      async () => {
        try {
          await createDeadlineReminders();
        } catch (error) {
          console.error("Deadline reminder service failed:", error.message);
        }
      },
      60 * 60 * 1000,
    );

    app.listen(PORT, "0.0.0.0",() => {
      console.log(`StudyTrack server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
