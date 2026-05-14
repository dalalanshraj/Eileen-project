import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    // 🔥 PASSWORD CHANGE TRACK
    lastPasswordChanged: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);