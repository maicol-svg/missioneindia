#!/usr/bin/env node
/**
 * One-shot migration: pushes local content (missione.json + content/*) into Sanity.
 * Run with: SANITY_AUTH_TOKEN=xxx node scripts/migrate-to-sanity.mjs
 */
import { createClient } from '@sanity/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const token = process.env.SANITY_AUTH_TOKEN;
if (!token) {
  console.error('Missing SANITY_AUTH_TOKEN env var');
  process.exit(1);
}

const client = createClient({
  projectId: 'a2760ao5',
  dataset: 'production',
  apiVersion: '2026-01-01',
  token,
  useCdn: false,
});

async function uploadAsset(relativePath) {
  const fullPath = path.join(ROOT, 'public', relativePath.replace(/^\//, ''));
  console.log('  Uploading asset:', relativePath);
  try {
    const buffer = await fs.readFile(fullPath);
    const filename = path.basename(fullPath);
    const asset = await client.assets.upload('image', buffer, { filename });
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    };
  } catch (e) {
    console.error('  Failed:', e.message);
    return null;
  }
}

/* ─── 1. Missione ─── */
async function migrateMissione() {
  console.log('\n→ Migrating missione...');
  const data = JSON.parse(await fs.readFile(path.join(ROOT, 'src/data/missione.json'), 'utf-8'));

  const doc = {
    _id: 'missione-india',
    _type: 'missione',
    nome: data.nome,
    localita: data.localita,
    anno_inizio: data.anno_inizio,
    tagline_hero: data.tagline_hero,
    tagline_secondaria: data.tagline_secondaria,
    frase_chiave: data.frase_chiave,
    frase_chiave_sub: data.frase_chiave_sub,
    descrizione_breve: data.descrizione_breve,
    stats: data.stats,
    storia: data.storia,
    aree_intervento: data.aree_intervento,
    obiettivi_raggiunti: data.obiettivi_raggiunti,
    obiettivi_da_raggiungere: data.obiettivi_da_raggiungere,
  };

  await client.createOrReplace(doc);
  console.log('  ✓ Missione document created/updated');
}

/* ─── 2. Aggiornamenti ─── */
async function migrateAggiornamenti() {
  console.log('\n→ Migrating aggiornamenti...');
  const dir = path.join(ROOT, 'src/content/aggiornamenti');
  let files;
  try {
    files = await fs.readdir(dir);
  } catch {
    console.log('  No aggiornamenti folder, skipping');
    return;
  }
  for (const file of files.filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    const raw = await fs.readFile(path.join(dir, file), 'utf-8');
    // Simple frontmatter parser
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) continue;
    const frontmatter = match[1];
    const body = match[2].trim();
    const fm = {};
    frontmatter.split('\n').forEach((line) => {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (m) {
        let v = m[2].trim();
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
        fm[m[1]] = v;
      }
    });

    console.log('  Processing:', slug);
    let imageObj = null;
    if (fm.image) imageObj = await uploadAsset(fm.image);

    // Convert markdown body to a single Sanity block (simple version)
    const bodyBlocks = body
      .split(/\n\n+/)
      .filter((p) => p.trim())
      .map((para) => {
        const isHeading = para.startsWith('## ');
        return {
          _type: 'block',
          _key: Math.random().toString(36).slice(2, 10),
          style: isHeading ? 'h2' : 'normal',
          children: [
            {
              _type: 'span',
              _key: Math.random().toString(36).slice(2, 10),
              text: isHeading ? para.replace(/^##\s+/, '') : para.replace(/\*\*(.+?)\*\*/g, '$1'),
              marks: [],
            },
          ],
          markDefs: [],
        };
      });

    const doc = {
      _id: `aggiornamento-${slug}`,
      _type: 'aggiornamento',
      title: fm.title,
      slug: { _type: 'slug', current: slug },
      date: new Date(fm.date).toISOString(),
      description: fm.description,
      ...(imageObj ? { image: imageObj } : {}),
      body: bodyBlocks,
    };

    await client.createOrReplace(doc);
    console.log('  ✓', slug);
  }
}

/* ─── 3. Galleria ─── */
async function migrateGalleria() {
  console.log('\n→ Migrating galleria...');
  const dir = path.join(ROOT, 'src/content/galleria');
  let files;
  try {
    files = await fs.readdir(dir);
  } catch {
    console.log('  No galleria folder, skipping');
    return;
  }
  for (const file of files.filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    const raw = await fs.readFile(path.join(dir, file), 'utf-8');
    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;
    const fm = {};
    match[1].split('\n').forEach((line) => {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (m) {
        let v = m[2].trim();
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
        fm[m[1]] = v;
      }
    });

    console.log('  Processing:', slug);
    if (!fm.image) {
      console.log('    skip (no image)');
      continue;
    }
    const imageObj = await uploadAsset(fm.image);
    if (!imageObj) continue;

    const doc = {
      _id: `foto-${slug}`,
      _type: 'foto',
      title: fm.title,
      caption: fm.caption || '',
      image: imageObj,
      date: fm.date ? new Date(fm.date).toISOString() : undefined,
      visible: fm.visible !== 'false',
    };

    await client.createOrReplace(doc);
    console.log('  ✓', slug);
  }
}

async function main() {
  console.log('Starting migration to Sanity (project a2760ao5)...');
  await migrateMissione();
  await migrateAggiornamenti();
  await migrateGalleria();
  console.log('\n✓ All done!');
}

main().catch((e) => {
  console.error('Migration failed:', e);
  process.exit(1);
});
