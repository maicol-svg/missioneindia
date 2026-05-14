import { defineType, defineField } from 'sanity';

export const missione = defineType({
  name: 'missione',
  title: 'Missione',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome missione',
      type: 'string',
      initialValue: 'Missione India',
    }),
    defineField({
      name: 'localita',
      title: 'Località',
      type: 'string',
      initialValue: 'Chennai, India',
    }),
    defineField({
      name: 'anno_inizio',
      title: 'Anno inizio',
      type: 'string',
      initialValue: '2024',
    }),
    defineField({
      name: 'tagline_hero',
      title: 'Tagline hero',
      description: 'La frase grande sotto al titolo',
      type: 'string',
      initialValue: 'INSIEME CAMBIAMO DESTINI',
    }),
    defineField({
      name: 'tagline_secondaria',
      title: 'Tagline secondaria',
      type: 'string',
      initialValue: 'La missione vive grazie a te',
    }),
    defineField({
      name: 'frase_chiave',
      title: 'Frase chiave',
      description: 'La frase principale della promessa (es. "Insieme possiamo dare ai bambini qualcosa che dura per sempre: la speranza.")',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'frase_chiave_sub',
      title: 'Sottotitolo frase chiave',
      type: 'string',
    }),
    defineField({
      name: 'descrizione_breve',
      title: 'Descrizione breve (hero)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'stats',
      title: 'Numeri principali',
      description: 'I numeri che vengono mostrati nella card della home',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'valore', title: 'Numero', type: 'string' },
            { name: 'etichetta', title: 'Etichetta', type: 'string' },
          ],
          preview: { select: { title: 'valore', subtitle: 'etichetta' } },
        },
      ],
    }),
    defineField({
      name: 'storia',
      title: 'Storia della missione',
      description: 'Ogni paragrafo è una voce separata',
      type: 'array',
      of: [{ type: 'text' }],
    }),
    defineField({
      name: 'aree_intervento',
      title: 'Aree di intervento',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'titolo', title: 'Titolo', type: 'string' },
            { name: 'descrizione', title: 'Descrizione', type: 'text', rows: 2 },
            {
              name: 'icona',
              title: 'Icona',
              type: 'string',
              options: {
                list: [
                  { title: 'Casa / Accoglienza', value: 'home' },
                  { title: 'Cibo / Nutrizione', value: 'food' },
                  { title: 'Libro / Istruzione', value: 'book' },
                  { title: 'Cuore / Cura spirituale', value: 'heart' },
                ],
              },
            },
          ],
          preview: { select: { title: 'titolo', subtitle: 'descrizione' } },
        },
      ],
    }),
    defineField({
      name: 'obiettivi_raggiunti',
      title: 'Obiettivi raggiunti',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'obiettivi_da_raggiungere',
      title: 'Obiettivi da raggiungere',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Missione India - Info principali' };
    },
  },
});
