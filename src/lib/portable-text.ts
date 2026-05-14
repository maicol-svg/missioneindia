import { toHTML } from '@portabletext/to-html';
import { urlFor } from './sanity';

export function renderPortableText(blocks: any): string {
  if (!blocks) return '';
  return toHTML(blocks, {
    components: {
      types: {
        image: ({ value }: any) => {
          const url = urlFor(value).width(1200).url();
          const caption = value.caption || '';
          const captionHtml = caption ? '<figcaption>' + caption + '</figcaption>' : '';
          return '<figure><img src="' + url + '" alt="' + caption + '" />' + captionHtml + '</figure>';
        },
      },
    },
  });
}
