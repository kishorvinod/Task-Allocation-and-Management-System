import { z } from "zod";

export const updateSkillsSchema =
  z.object({
    skills: z.array(
      z.string()
    )
  });

export const updateAvailabilitySchema =
  z.object({
    availableHoursPerDay:
      z.number().positive(),

    workingDays:
      z.array(
        z.string()
      )
  });