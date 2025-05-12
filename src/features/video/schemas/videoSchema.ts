import { z } from 'zod';

export const videoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const videoSchemaInput = videoSchema.omit({ 
  id: true,
  createdAt: true,
  updatedAt: true 
});

export type Videoschema = z.infer<typeof videoSchema>;
export type VideoschemaInput = z.infer<typeof videoSchemaInput>;