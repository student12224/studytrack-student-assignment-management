import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },

    description: {
      type: String,
      default: "",
      maxlength: 3000,
    },

    subject: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    dueDate: {
      type: Date,
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

assignmentSchema.index({
  user: 1,
  dueDate: 1,
});

export default mongoose.model("Assignment", assignmentSchema);
