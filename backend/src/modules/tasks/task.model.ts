import mongoose, {
    Schema,
    Document,
    Types
} from "mongoose";

export type TaskStatus =
    | "Pending"
    | "In Progress"
    | "Completed";

export type TaskPriority =
    | "Low"
    | "Medium"
    | "High";

export interface ITask extends Document {
    title: string;

    description: string;

    status: TaskStatus;

    priority: TaskPriority;

    estimatedHours: number;

    requiredSkill: string;

    assignedUser?: Types.ObjectId;

    dueDate: Date;

    createdBy: Types.ObjectId;
}

const TaskSchema =
    new Schema<ITask>(
        {
            title: {
                type: String,
                required: true,
                trim: true
            },

            description: {
                type: String,
                default: ""
            },

            status: {
                type: String,
                enum: [
                    "Pending",
                    "In Progress",
                    "Completed"
                ],
                default: "Pending"
            },

            priority: {
                type: String,
                enum: [
                    "Low",
                    "Medium",
                    "High"
                ],
                default: "Medium"
            },

            estimatedHours: {
                type: Number,
                required: true
            },

            requiredSkill: {
                type: String,
                required: true
            },

            assignedUser: {
                type:
                    Schema.Types.ObjectId,
                ref: "User"
            },

            dueDate: {
                type: Date,
                required: true
            },

            createdBy: {
                type:
                    Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        },
        {
            timestamps: true
        }
    );

TaskSchema.index({ title: "text" });
TaskSchema.index({ priority: 1 });
TaskSchema.index({
    status: 1
});
TaskSchema.index({
    assignedUser: 1
});
TaskSchema.index({
  dueDate: 1
});
TaskSchema.index({
  status: 1,
  priority: 1
});

export const Task =
    mongoose.model<ITask>(
        "Task",
        TaskSchema
    );