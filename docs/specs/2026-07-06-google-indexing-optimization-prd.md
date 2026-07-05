# Google indexing optimization PRD

Date: 2026-07-06
Owner: Codex
Status: Implemented in `codex/seo-indexing-foundation`

## Goal
Improve Google discovery, crawling and indexing for A-Level Hub by exposing real crawlable URLs for core public study content and by publishing machine-readable sitemap, robots, canonical metadata and structured data.

## Scope
- Public subject directory: `/subjects`
- Public subject landing pages: `/subjects/:subject`
- Public unit pages: `/subjects/:subject/:unit`
- Public chapter pages: `/subjects/:subject/:unit/:chapter`
- Public past-paper directory: `/resources/past-papers`
- Build-generated `robots.txt` and `sitemap.xml`
- Build-generated static HTML shells for SEO routes

## Non-goals
- Full SSR migration
- Google Search Console account verification token setup
- Ranking guarantee
- Backlink campaign
- Changing protected practice, exam, profile or admin workflows

## Acceptance criteria
- `npm run build` generates `public/sitemap.xml`, `public/robots.txt` and prerendered route HTML under `dist/subjects/**` and `dist/resources/past-papers/index.html`.
- Sitemap contains one canonical URL for every public subject, unit and chapter route.
- Public SEO pages render crawlable anchor links from subject to unit to chapter.
- Each prerendered page has unique title, description, canonical and JSON-LD.
- Protected/auth-only pages are not listed in the sitemap.
- Tests verify route uniqueness, metadata generation and full chapter coverage.

## Google-source basis
- Google Search discovers pages through crawling and links, then renders and indexes content.
- Sitemaps help Google discover important canonical URLs, but do not guarantee indexing.
- robots.txt manages crawler access and must not be used as a security or indexing-hiding mechanism.
- JavaScript sites should expose crawlable links and renderable content for Googlebot.

## Follow-up
- Add Google Search Console property verification and submit `/sitemap.xml`.
- Monitor Coverage, Pages and URL Inspection reports after deployment.
- If organic acquisition becomes a priority, migrate the highest-value pages to SSR/SSG or a static pre-render pipeline with full visible content in HTML.
