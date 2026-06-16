import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  role: "admin" | "user";

  skills: string[];

  availableHoursPerDay: number;

  workingDays: string[];
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },

    skills: {
      type: [String],
      default: []
    },

    availableHoursPerDay: {
      type: Number,
      default: 8
    },

    workingDays: {
      type: [String],
      default: ["Mon", "Tue", "Wed", "Thu", "Fri"]
    }
  },
  {
    timestamps: true
  }

);

UserSchema.index({ email: 1 });
UserSchema.index({skills: 1 });

export const User = mongoose.model<IUser>(
  "User",
  UserSchema
);