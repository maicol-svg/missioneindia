/**
 * Content loader: Sanity è l'unica fonte di verità.
 * Tutti i contenuti dinamici (missione info, aggiornamenti, galleria)
 * vengono dal Sanity Studio: https://missioneindia-studio.vercel.app
 */
import {
  getMissione as getMissioneSanity,
  getAggiornamenti as getAggSanity,
  getAggiornamentoBySlug as getAggBySlugSanity,
  getGalleria as getGalSanity,
  urlFor,
  type Missione,
  type Aggiornamento,
  type FotoGalleria,
} from './sanity';

export type ResolvedAggiornamento = {
  slug: string;
  title: string;
  date: Date;
  description: string;
  image?: string;
  body?: any;
  tags?: string[];
};

export type ResolvedFoto = {
  id: string;
  title: string;
  caption?: string;
  image: string;
  date?: Date;
};

/* ─── Missione ─── */
export async function loadMissione(): Promise<Missione | null> {
  try {
    return await getMissioneSanity();
  } catch (e) {
    console.error('Failed to load missione from Sanity:', e);
    return null;
  }
}

/* ─── Aggiornamenti ─── */
export async function loadAggiornamenti(limit?: number): Promise<ResolvedAggiornamento[]> {
  try {
    const docs = await getAggSanity(limit);
    return docs.map((a) => ({
      slug: a.slug,
      title: a.title,
      date: new Date(a.date),
      description: a.description,
      image: a.image ? urlFor(a.image).width(1200).url() : undefined,
      body: a.body,
      tags: a.tags,
    }));
  } catch (e) {
    console.error('Failed to load aggiornamenti from Sanity:', e);
    return [];
  }
}

export async function loadAggiornamentoBySlug(slug: string): Promise<ResolvedAggiornamento | null> {
  try {
    const a = await getAggBySlugSanity(slug);
    if (!a) return null;
    return {
      slug: a.slug,
      title: a.title,
      date: new Date(a.date),
      description: a.description,
      image: a.image ? urlFor(a.image).width(1600).url() : undefined,
      body: a.body,
      tags: a.tags,
    };
  } catch (e) {
    console.error('Failed to load aggiornamento from Sanity:', e);
    return null;
  }
}

export async function loadAggiornamentoSlugs(): Promise<string[]> {
  try {
    const all = await getAggSanity();
    return all.map((a) => a.slug).filter(Boolean);
  } catch (e) {
    console.error('Failed to load aggiornamento slugs from Sanity:', e);
    return [];
  }
}

/* ─── Galleria ─── */
export async function loadGalleria(): Promise<ResolvedFoto[]> {
  try {
    const docs = await getGalSanity();
    return docs.map((f) => ({
      id: f._id,
      title: f.title,
      caption: f.caption,
      image: urlFor(f.image).width(1200).url(),
      date: f.date ? new Date(f.date) : undefined,
    }));
  } catch (e) {
    console.error('Failed to load galleria from Sanity:', e);
    return [];
  }
}
