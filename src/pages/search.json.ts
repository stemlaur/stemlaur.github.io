import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { parsePost, sortPostsDesc } from '../utils/posts';

export async function GET(_context: APIContext) {
  const entries = await getCollection('blog');
  const sorted = sortPostsDesc(entries.map(parsePost));

  const searchData = sorted.map((post) => ({
    title: post.title,
    url: post.permalink,
    date: post.formattedDate,
    tags: post.tags,
    excerpt: post.excerpt.slice(0, 150),
    readingTime: post.readingTime,
  }));

  // Also include Nikonov
  searchData.unshift({
    title: 'Nikonov',
    url: '/nikonov/',
    date: 'Roman court',
    tags: ['nouvelle'],
    excerpt: 'En dernière classe, Ivan Volodia Nikonov se mêlait à une population de besogneux, de clochards, de familles nombreuses aux enfants colériques...',
    readingTime: '15 min de lecture',
  });

  return new Response(JSON.stringify(searchData), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
