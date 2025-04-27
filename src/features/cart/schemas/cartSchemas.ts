import { z } from "zod";

export const cartCreateSchema = z.object({
  title: z.string().min(3, "Title too short"),
  content: z.string().min(10, "Content too short"),
});

export const cartUpdateSchema = z.object({
  id: z.number(),
  title: z.string().min(3, "Title too short"),
  content: z.string().min(10, "Content too short"),
});

export const cartDeleteSchema = z.object({
  id: z.number(),
});
