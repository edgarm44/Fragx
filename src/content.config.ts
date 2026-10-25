import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    titre: z.string(),
    description: z.string(),
    jeu: z.enum(['Tous les jeux', 'Valorant', 'Fortnite', 'Apex Legends', 'Call of Duty', 'Battlefield']),
    misAJour: z.coerce.date(),
  }),
});

export const collections = { guides };
