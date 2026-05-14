import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const aggiornamenti = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/aggiornamenti' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Missione India'),
    description: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const galleria = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/galleria' }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    caption: z.string().optional(),
    date: z.coerce.date().optional(),
    visible: z.boolean().default(true),
  }),
});

export const collections = { aggiornamenti, galleria };
