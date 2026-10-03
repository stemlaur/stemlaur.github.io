import { describe, it, expect } from 'vitest';
import { calculateReadingTime, cleanExcerpt, parsePost, sortPostsDesc, type FormattedPost } from './posts';
import type { CollectionEntry } from 'astro:content';

describe('posts utilities', () => {
  describe('cleanExcerpt', () => {
    it('returns empty string for empty input', () => {
      expect(cleanExcerpt('')).toBe('');
    });

    it('removes HTML tags', () => {
      expect(cleanExcerpt('<p>Bonjour <strong>le monde</strong></p>')).toBe('Bonjour le monde');
    });

    it('removes Markdown headings, links, bold and italic syntaxes', () => {
      const markdown = '# Titre\n\nVoici du texte avec du **gras**, des __mots en gras__, de *l\'italique* et de l\'_italique avec underscore_, ainsi qu\'un [lien](https://example.com). <!-- comment -->';
      expect(cleanExcerpt(markdown)).toBe("Voici du texte avec du gras, des mots en gras, de l'italique et de l'italique avec underscore, ainsi qu'un lien.");
    });
  });

  describe('calculateReadingTime', () => {
    it('returns 1 min de lecture for short text', () => {
      const result = calculateReadingTime('Ceci est un court texte.');
      expect(result.minutes).toBe(1);
      expect(result.text).toBe('1 min de lecture');
      expect(result.wordsCount).toBe(5);
    });

    it('calculates reading time based on 200 words per minute', () => {
      const words = Array(450).fill('mot').join(' ');
      const result = calculateReadingTime(words);
      expect(result.minutes).toBe(3);
      expect(result.text).toBe('3 min de lecture');
      expect(result.wordsCount).toBe(450);
    });

    it('ignores code blocks and html tags when calculating reading time', () => {
      const content = `
        Voici une introduction de 5 mots.
        \`\`\`typescript
        const a = 1;
        const b = 2;
        const c = 3;
        function test() { return 42; }
        \`\`\`
        <div class="note">Et voici une conclusion.</div>
      `;
      const result = calculateReadingTime(content);
      // Code block should be stripped, only intro and conclusion remain
      expect(result.wordsCount).toBeLessThan(20);
    });
  });

  describe('parsePost', () => {
    it('parses post date, slug, and formats French date', () => {
      const mockEntry: CollectionEntry<'blog'> = {
        id: '2021-04-12-tech-adr.md',
        body: 'Introduction text.\n\n<!--more-->\n\nFull article content.',
        data: {
          title: 'Architecture Decision Records',
          tags: ['tech'],
        },
      } as unknown as CollectionEntry<'blog'>;

      const post = parsePost(mockEntry);

      expect(post.year).toBe('2021');
      expect(post.month).toBe('04');
      expect(post.day).toBe('12');
      expect(post.slug).toBe('tech-adr');
      expect(post.permalink).toBe('/blog/2021/04/12/tech-adr/');
      expect(post.formattedDate).toBe('12 avril 2021');
      expect(post.isoDate).toBe('2021-04-12');
      expect(post.excerpt).toBe('Introduction text.');
      expect(post.readingTime).toBe('1 min de lecture');
      expect(post.tags).toEqual(['tech']);
    });

    it('prefers frontmatter description over raw body excerpt if present', () => {
      const mockEntry: CollectionEntry<'blog'> = {
        id: '2020-05-06-fusion.md',
        body: 'Trois ans plus tard...\n\n<!--more-->\n\nLe reste.',
        data: {
          title: 'Fusion',
          description: 'Custom SEO description from frontmatter',
          tags: 'nouvelle',
        },
      } as unknown as CollectionEntry<'blog'>;

      const post = parsePost(mockEntry);

      expect(post.excerpt).toBe('Custom SEO description from frontmatter');
      expect(post.tags).toEqual(['nouvelle']);
    });

    it('normalizes single tag string into array', () => {
      const mockEntry: CollectionEntry<'blog'> = {
        id: '2020-05-01-le-corbeau.md',
        body: 'Premier paragraphe sans more tag.',
        data: {
          title: 'Le corbeau',
          tags: 'nouvelle',
        },
      } as unknown as CollectionEntry<'blog'>;

      const post = parsePost(mockEntry);

      expect(post.tags).toEqual(['nouvelle']);
      expect(post.excerpt).toBe('Premier paragraphe sans more tag.');
    });
  });

  describe('sortPostsDesc', () => {
    it('sorts posts chronologically descending without mutating the original array', () => {
      const postA = {
        title: 'Older',
        dateObj: new Date('2020-01-01'),
      } as FormattedPost;

      const postB = {
        title: 'Newer',
        dateObj: new Date('2021-01-01'),
      } as FormattedPost;

      const original = [postA, postB];
      const sorted = sortPostsDesc(original);

      expect(sorted[0].title).toBe('Newer');
      expect(sorted[1].title).toBe('Older');
      // Original array remains unmodified
      expect(original[0].title).toBe('Older');
      expect(original[1].title).toBe('Newer');
    });
  });
});
