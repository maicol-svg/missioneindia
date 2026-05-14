import { defineType, defineField } from 'sanity';

export const aggiornamento = defineType({
  name: 'aggiornamento',
  title: 'Aggiornamento dal campo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Data pubblicazione',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'description',
      title: 'Descrizione breve',
      description: 'Appare nella lista e nei meta tag SEO. Max 200 caratteri.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'image',
      title: 'Immagine di copertina',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'body',
      title: 'Contenuto',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normale', value: 'normal' },
            { title: 'Titolo H2', value: 'h2' },
            { title: 'Titolo H3', value: 'h3' },
            { title: 'Citazione', value: 'blockquote' },
          ],
          lists: [
            { title: 'Elenco puntato', value: 'bullet' },
            { title: 'Elenco numerato', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Grassetto', value: 'strong' },
              { title: 'Corsivo', value: 'em' },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'caption', title: 'Didascalia', type: 'string' }],
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tag',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'date', media: 'image' },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString('it-IT') : '',
        media,
      };
    },
  },
});
