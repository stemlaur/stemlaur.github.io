import type { CollectionEntry } from 'astro:content';

export interface FormattedPost {
  entry: CollectionEntry<'blog'>;
  year: string;
  month: string;
  day: string;
  slug: string;
  permalink: string;
  dateObj: Date;
  formattedDate: string;
  isoDate: string;
  title: string;
  image?: string;
  tags: string[];
  excerpt: string;
  readingTime: string;
  wordsCount: number;
}

const MONTH_NAMES_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
];

export function calculateReadingTime(text: string): { wordsCount: number; minutes: number; text: string } {
  const clean = text
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/<[^>]*>/g, '') // remove html
    .trim();
  const words = clean.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return {
    wordsCount: words,
    minutes,
    text: `${minutes} min de lecture`,
  };
}

export function parsePost(entry: CollectionEntry<'blog'>): FormattedPost {
  // entry.id format: "2020-04-22-le-voisin-de-train.md" or "2020-04-22-le-voisin-de-train"
  const cleanId = entry.id.replace(/\.md$/, '');
  const match = cleanId.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);

  let year = '2020';
  let month = '01';
  let day = '01';
  let slug = cleanId;

  if (match) {
    year = match[1];
    month = match[2];
    day = match[3];
    slug = match[4];
  }

  const dateObj = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)));
  const formattedDate = `${parseInt(day, 10)} ${MONTH_NAMES_FR[parseInt(month, 10) - 1]} ${year}`;
  const isoDate = `${year}-${month}-${day}`;
  const permalink = `/blog/${year}/${month}/${day}/${slug}/`;

  // Raw body for excerpt & reading time
  const rawBody = entry.body || '';
  const { wordsCount, text: readingTime } = calculateReadingTime(rawBody);

  let excerpt = '';
  if (entry.data.description && entry.data.description.trim()) {
    excerpt = entry.data.description.trim();
  } else if (rawBody.includes('<!--more-->')) {
    excerpt = rawBody.split('<!--more-->')[0].trim();
  } else {
    // Take first paragraph
    const paragraphs = rawBody.split(/\n\s*\n/).filter(p => !p.startsWith('#') && !p.startsWith('---'));
    excerpt = paragraphs[0] || '';
  }

  const tags = Array.isArray(entry.data.tags)
    ? entry.data.tags
    : entry.data.tags
    ? [entry.data.tags]
    : [];

  return {
    entry,
    year,
    month,
    day,
    slug,
    permalink,
    dateObj,
    formattedDate,
    isoDate,
    title: entry.data.title,
    image: entry.data.image,
    tags,
    excerpt,
    readingTime,
    wordsCount,
  };
}

export function sortPostsDesc(posts: FormattedPost[]): FormattedPost[] {
  return [...posts].sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
}
