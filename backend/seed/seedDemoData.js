import "dotenv/config";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import Assignment from "../src/models/Assignment.js";
import Notification from "../src/models/Notification.js";

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
};

const seedDemoData = async () => {
  try {
    await connectDatabase();

    const email = process.env.DEMO_STUDENT_EMAIL;

    if (!email) {
      throw new Error("DEMO_STUDENT_EMAIL is missing from .env");
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      throw new Error(
        "Student account not found. Register first and check DEMO_STUDENT_EMAIL.",
      );
    }

    const now = new Date();

    const sampleAssignments = [
      {
        title: "Database Management Assignment",
        subject: "Database Systems",
        description: "Prepare database design and documentation.",
        dueDate: new Date(now.getTime() + 2 * 86400000),
        priority: "high",
        status: "pending",
      },
      {
        title: "Research Methodology Report",
        subject: "Research Methods",
        description: "Complete the research methodology report.",
        dueDate: new Date(now.getTime() + 5 * 86400000),
        priority: "medium",
        status: "in-progress",
      },
      {
        title: "Web Application Development",
        subject: "Web Development",
        description: "Develop and test the application interface.",
        dueDate: new Date(now.getTime() + 8 * 86400000),
        priority: "high",
        status: "pending",
      },
      {
        title: "Software Engineering Presentation",
        subject: "Software Engineering",
        description: "Prepare the project presentation.",
        dueDate: new Date(now.getTime() + 12 * 86400000),
        priority: "low",
        status: "completed",
      },
      {
        title: "Information Systems Case Study",
        subject: "Information Systems",
        description: "Analyse the selected case study.",
        dueDate: new Date(now.getTime() + 15 * 86400000),
        priority: "medium",
        status: "in-progress",
      },
    ];

    const createdAssignments = [];

    for (const item of sampleAssignments) {
      let assignment = await Assignment.findOne({
        user: user._id,
        title: item.title,
      });

      if (!assignment) {
        assignment = await Assignment.create({
          ...item,
          user: user._id,
        });
      }

      createdAssignments.push(assignment);
    }

    const sampleNotifications = [
      {
        title: "Welcome to StudyTrack",
        message:
          "Your student workspace is ready. Start organising your assignments.",
        type: "system",
      },
      {
        title: "Assignment added",
        message:
          "Your Database Management Assignment is available in your workspace.",
        type: "system",
      },
      {
        title: "Upcoming deadline",
        message: "Your Database Management Assignment is due in two days.",
        type: "deadline",
      },
    ];

    for (const item of sampleNotifications) {
      await Notification.updateOne(
        {
          user: user._id,
          title: item.title,
          message: item.message,
        },
        {
          $setOnInsert: {
            ...item,
            user: user._id,
            read: false,
          },
        },
        { upsert: true },
      );
    }

    console.log("StudyTrack demo data seeded successfully.");
    console.log(`Assignments available: ${createdAssignments.length}`);
    console.log(`Notifications checked: ${sampleNotifications.length}`);
  } catch (error) {
    console.error("Demo seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedDemoData();
