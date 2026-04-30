import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,        // ← Firebase UID (string) – আগের ObjectId নয়
      required: true,
      index: true,         // পারফরম্যান্সের জন্য ইনডেক্স যোগ করা ভালো
    },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);