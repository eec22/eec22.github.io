import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    legacyPath: z.string().optional(),
    cover: z.string().optional(),
    aiAssisted: z.boolean().default(false),
    investment: z.boolean().default(false),
  }),
});

export const collections = { notes };
