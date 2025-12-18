import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      match: [/^[A-Za-z]+$/, 'Name must contain only English letters']
    },
    email: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
