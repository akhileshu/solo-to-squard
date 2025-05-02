import { ConnectionStatus } from "@prisma/client";
import { z } from "zod";

export const sendConnectionSchema = z.object({
  receiverId: z.string().min(3, "receiverId too short"),
  message: z.string().min(10, "Content too short").optional(),
});

export const connectionStatusUpdateSchema = z.object({
  connectionId: z.string().min(3, "connectionId too short"),
  newStatus: z.enum(Object.values(ConnectionStatus) as [string, ...string[]]),
  // newStatus: z.string().min(10, "Content too short"),
});

export const connectionDeleteSchema = z.object({
  id: z.number(),
});
