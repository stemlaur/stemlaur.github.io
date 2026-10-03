import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { parsePost, sortPostsDesc } from '../utils/posts';

export async function GET(context: APIContext) {
  const blogEntries = await getCollection('blog');
  const sortedPosts = sortPostsDesc(blogEntries.map(parsePost));

  return rss({
    title: 'stemlaur.com',
    description: 'Nouvelles, contes et réflexions logicielles de Laurent Stemmer',
    site: context.site || 'https://www.stemlaur.com',
    items: sortedPosts.map((post) => ({
      title: post.title,
      pubDate: post.dateObj,
      description: post.excerpt,
      link: post.permalink,
    })),
    customData: '<language>fr</language>',
  });
}
