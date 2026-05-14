import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'missione-india',
  title: 'Missione India',
  projectId: 'a2760ao5',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenuti')
          .items([
            S.listItem()
              .title('Missione (info principali)')
              .child(
                S.document()
                  .schemaType('missione')
                  .documentId('missione-india')
                  .title('Missione India')
              ),
            S.divider(),
            S.listItem()
              .title('Aggiornamenti dal campo')
              .schemaType('aggiornamento')
              .child(S.documentTypeList('aggiornamento').title('Aggiornamenti')),
            S.listItem()
              .title('Galleria foto')
              .schemaType('foto')
              .child(S.documentTypeList('foto').title('Galleria')),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
