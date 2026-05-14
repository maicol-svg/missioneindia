/**
 * Content loader con fallback automatico.
 * Strategia: prova prima Sanity. Se restituisce vuoto/errore, usa i file locali.
 * Questo permette di lanciare il sito anche se Sanity non è ancora popolato.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { getMissione as getMissioneSanity, getAggiornamenti as getAggSanity, getAggiornamentoBySlug as getAggBySlugSanity, getGalleria as getGalSanity, urlFor, type Missione, type Aggiornamento, type FotoGalleria } from './sanity';
import missioneLocal from '../data/missione.json';

export type ResolvedAggiornamento = {
  slug: string;
  title: string;
  date: Date;
  description: string;
  image?: string;
  body?: any; // markdown string OR Sanity portable text
  bodySource: 'sanity' | 'markdown';
  tags?: string[];
};

export type ResolvedFoto = {
  id: string;
  title: string;
  caption?: string;
  image: string;
  date?: Date;
};

/* ─────────── Missione ─────────── */
export async function loadMissione(): Promise<Missione> {
  try {
    const sanity = await getMissioneSanity();
    if (sanity && sanity.nome) return sanity;
  } catch (e) {
    // Sanity unreachable or empty — fall back
  }
  return missioneLocal as Missione;
}

/* ─────────── Aggiornamenti ─────────── */
export async function loadAggiornamenti(limit?: number): Promise<ResolvedAggiornamento[]> {
  try {
    const sanity = await getAggSanity(limit);
    if (sanity && sanity.length > 0) {
      return sanity.map((a) => ({
        slug: a.slug,
        title: a.title,
        date: new Date(a.date),
        description: a.description,
        image: a.image ? urlFor(a.image).width(1200).url() : undefined,
        body: a.body,
        bodySource: 'sanity' as const,
        tags: a.tags,
      }));
    }
  } catch (e) {
    // fall back
  }

  // Fallback: Astro content collection
  const entries = (await getCollection('aggiornamenti'))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const sliced = limit ? entries.slice(0, limit) : entries;
  return sliced.map((e) => ({
    slug: e.id.replace(/\.md$/, ''),
    title: e.data.title,
    date: e.data.date,
    description: e.data.description,
    image: e.data.image,
    body: e,
    bodySource: 'markdown' as const,
    tags: e.data.tags,
  }));
}

export async function loadAggiornamentoBySlug(slug: string): Promise<ResolvedAggiornamento | null> {
  try {
    const a = await getAggBySlugSanity(slug);
    if (a) {
      return {
        slug: a.slug,
        title: a.title,
        date: new Date(a.date),
        description: a.description,
        image: a.image ? urlFor(a.image).width(1600).url() : undefined,
        body: a.body,
        bodySource: 'sanity' as const,
        tags: a.tags,
      };
    }
  } catch (e) {
    // fall back
  }
  // Local fallback
  const all = await getCollection('aggiornamenti');
  const found = all.find((e) => e.id.replace(/\.md$/, '') === slug);
  if (!found) return null;
  return {
    slug,
    title: found.data.title,
    date: found.data.date,
    description: found.data.description,
    image: found.data.image,
    body: found,
    bodySource: 'markdown' as const,
    tags: found.data.tags,
  };
}

export async function loadAggiornamentoSlugs(): Promise<string[]> {
  // Combine Sanity + local slugs for static path generation
  const slugs = new Set<string>();
  try {
    const sanity = await getAggSanity();
    sanity.forEach((a) => slugs.add(a.slug));
  } catch (e) {}
  try {
    const local = await getCollection('aggiornamenti');
    local.forEach((e) => slugs.add(e.id.replace(/\.md$/, '')));
  } catch (e) {}
  return Array.from(slugs);
}

/* ─────────── Galleria ─────────── */
export async function loadGalleria(): Promise<ResolvedFoto[]> {
  try {
    const sanity = await getGalSanity();
    if (sanity && sanity.length > 0) {
      return sanity.map((f) => ({
        id: f._id,
        title: f.title,
        caption: f.caption,
        image: urlFor(f.image).width(1200).url(),
        date: f.date ? new Date(f.date) : undefined,
      }));
    }
  } catch (e) {}

  // Fallback: Astro content collection
  const entries = (await getCollection('galleria'))
    .filter((e) => e.data.visible !== false)
    .sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));
  return entries.map((e) => ({
    id: e.id,
    title: e.data.title,
    caption: e.data.caption,
    image: e.data.image,
    date: e.data.date,
  }));
}
