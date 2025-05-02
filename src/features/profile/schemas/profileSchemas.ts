import { domains } from "@/lib/data/profile";
import { z } from "zod";


export const profileSetupSchema = z.object({
  domain: z.enum(Object.values(domains) as [string, ...string[]]),
  skills: z
    .string()
    .transform((val) => val.split(",").filter(Boolean))
    .refine((arr) => arr.length > 0, { message: "Select at least one skill" }),

  learning: z
    .string()
    .transform((val) => val.split(",").filter(Boolean))
    .optional(),

  goals: z
    .string()
    .transform((val) => val.split(",").filter(Boolean))
    .optional(),

  availability: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((num) => !isNaN(num), { message: "Invalid availability number" }),
});

export const profileUpdateSchema = z.object({
  domain: z.enum(Object.values(domains) as [string, ...string[]]),
  skills: z
    .string()
    .transform((val) => val.split(",").filter(Boolean))
    .refine((arr) => arr.length > 0, { message: "Select at least one skill" }),

  learning: z
    .string()
    .transform((val) => val.split(",").filter(Boolean))
    .optional(),

  goals: z
    .string()
    .transform((val) => val.split(",").filter(Boolean))
    .optional(),

  availability: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((num) => !isNaN(num), { message: "Invalid availability number" }),
});



