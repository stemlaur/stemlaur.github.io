# stemlaur.com — Blog de Laurent Stemmer

Modern personal blog and storytelling platform built with **[Astro 5](https://astro.build)**, **TypeScript**, and **[Tailwind CSS](https://tailwindcss.com)**.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20.x or 22.x
- npm >= 10.x

### Installation
```bash
npm install
```

### Development
Start the local development server with hot-reload:
```bash
npm run dev
```
Open [http://localhost:4321](http://localhost:4321) in your browser.

### Production Build & Preview
Typecheck and build the static site into `dist/`:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 🏗️ Architecture & Features

- **Framework**: Astro 5 (zero client-side JS runtime by default for ultimate speed and SEO).
- **Type Safety**: Full TypeScript support with Astro Content Collections and Zod schema validation in `src/content/config.ts`.
- **Styling**: Tailwind CSS with `@tailwindcss/typography` for clean article readability and responsive layouts.
- **Routing & SEO Continuity**:
  - Home: `/`
  - Blog: `/blog/` & `/blog/2/`, `/blog/3/`, etc. (paginated, 10 posts per page)
  - Articles: `/blog/:year/:month/:day/:slug/` (100% backward-compatible with legacy Jekyll permalinks)
  - Tags: `/tags/tech/`, `/tags/inc/`, `/tags/nouvelle/`
  - About: `/about/`
  - 404: `/404.html`
- **Comments**: Hyvor Talk widget preserved and integrated in `src/components/HyvorTalk.astro` (Website ID `757`).
- **RSS & Sitemap**:
  - RSS 2.0 Feed: `/rss.xml` and `/atom.xml` generated automatically via `@astrojs/rss`.
  - XML Sitemap: `/sitemap.xml` generated automatically via `@astrojs/sitemap`.
- **Continuous Deployment**: Automated GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages upon push to `master`.

---

## 📝 Writing a New Article

Add a new markdown file inside `src/content/blog/` following the naming convention:
```
YYYY-MM-DD-your-article-slug.md
```

Example frontmatter:
```markdown
---
title: Mon nouvel article
tags: tech
image: /assets/images/posts/my-image.jpg
description: Description courte pour le SEO et l'aperçu.
---

Votre texte d'introduction ici...

<!--more-->

Le reste de l'article avec code ou explications...
```

The date is automatically parsed from the filename prefix (`YYYY-MM-DD`). The summary card excerpt will use whatever is above `<!--more-->`.
