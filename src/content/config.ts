import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    layout: z.string().optional(),
  }),
});

export const collections = { blog };
