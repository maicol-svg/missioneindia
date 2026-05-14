import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const SANITY_PROJECT_ID = 'a2760ao5';
export const SANITY_DATASET = 'production';

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2026-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

/* ── Queries ── */

export interface Aggiornamento {
  _id: string;
  slug: string;
  title: string;
  date: string;
  description: string;
  image?: any;
  body?: any;
  tags?: string[];
}

export interface FotoGalleria {
  _id: string;
  title: string;
  caption?: string;
  image: any;
  date?: string;
}

export interface Obiettivo {
  testo: string;
  raggiunto: boolean;
}

export interface AreaIntervento {
  titolo: string;
  descrizione: string;
  icona: 'home' | 'food' | 'book' | 'heart';
}

export interface Missione {
  nome: string;
  localita: string;
  anno_inizio: string;
  tagline_hero: string;
  tagline_secondaria: string;
  frase_chiave: string;
  frase_chiave_sub: string;
  descrizione_breve: string;
  stats: { valore: string; etichetta: string }[];
  storia: string[];
  aree_intervento: AreaIntervento[];
  obiettivi_raggiunti: string[];
  obiettivi_da_raggiungere: string[];
}

export async function getAggiornamenti(limit?: number): Promise<Aggiornamento[]> {
  const q = `*[_type == "aggiornamento"] | order(date desc) ${limit ? `[0...${limit}]` : ''} {
    _id,
    "slug": slug.current,
    title,
    date,
    description,
    image,
    body,
    tags
  }`;
  return sanityClient.fetch(q);
}

export async function getAggiornamentoBySlug(slug: string): Promise<Aggiornamento | null> {
  const q = `*[_type == "aggiornamento" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    title,
    date,
    description,
    image,
    body,
    tags
  }`;
  return sanityClient.fetch(q, { slug });
}

export async function getGalleria(): Promise<FotoGalleria[]> {
  const q = `*[_type == "foto" && visible == true] | order(date desc) {
    _id,
    title,
    caption,
    image,
    date
  }`;
  return sanityClient.fetch(q);
}

export async function getMissione(): Promise<Missione | null> {
  const q = `*[_type == "missione"][0]`;
  return sanityClient.fetch(q);
}
