import { z } from 'zod';

export const videoInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const videoInputSchemaInput = videoInputSchema.omit({ 
  id: true,
  createdAt: true,
  updatedAt: true 
});

export type Videoinputschema = z.infer<typeof videoInputSchema>;
export type VideoinputschemaInput = z.infer<typeof videoInputSchemaInput>;