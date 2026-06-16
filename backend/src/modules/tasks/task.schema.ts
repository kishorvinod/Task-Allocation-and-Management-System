import { z } from "zod";

export const createTaskSchema =
  z.object({
    title: z
      .string()
      .min(3, "Title is required"),

    description: z
      .string()
      .optional(),

    priority: z.enum([
      "Low",
      "Medium",
      "High"
    ]),

    estimatedHours: z
      .number()
      .positive(),

    requiredSkill: z
      .string()
      .min(1),

    dueDate: z.string()
  });

export const updateStatusSchema =
  z.object({
    status: z.enum([
      "Pending",
      "In Progress",
      "Completed"
    ])
  });