import { defineType, defineField } from 'sanity';

export const foto = defineType({
  name: 'foto',
  title: 'Foto della galleria',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Immagine',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Didascalia',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Data scatto',
      type: 'datetime',
    }),
    defineField({
      name: 'visible',
      title: 'Visibile sul sito',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'caption', media: 'image' },
  },
});
