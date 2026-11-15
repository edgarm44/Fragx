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
    /** Date de la dernière vérification des réglages auprès des sources */
    verifie: z.coerce.date().optional(),
    /** Identifiant du jeu dans src/data/jeux.ts : active l'encadré d'outils et les repères des pros */
    jeuId: z.enum(['valorant', 'fortnite', 'apex', 'cod', 'bf6']).optional(),
  }),
});

export const collections = { guides };
