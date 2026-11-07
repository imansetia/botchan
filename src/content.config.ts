import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    number: z.number(),
    summary: z.string(),
    status: z.enum(['in-progress', 'done']),
    date: z.coerce.date(),
    stack: z.array(z.string()).optional(),
    repo: z.string().url().optional(),
    live: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
