import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL, canonicalUrl, getSeoRoutes } from '../src/utils/seoData.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const publicDir = join(root, 'public')
const today = new Date().toISOString().slice(0, 10)

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

mkdirSync(publicDir, { recursive: true })

const sitemapEntries = getSeoRoutes().map(route => [
  '  <url>',
  `    <loc>${xmlEscape(canonicalUrl(route.path))}</loc>`,
  `    <lastmod>${today}</lastmod>`,
  '  </url>',
].join('\n'))

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapEntries,
  '</urlset>',
  '',
].join('\n')

const robots = [
  'User-agent: *',
  'Allow: /',
  'Disallow: /login',
  'Disallow: /register',
  'Disallow: /profile',
  'Disallow: /exams',
  'Disallow: /learning-plan',
  'Disallow: /wrong-questions',
  'Disallow: /questions/upload',
  '',
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  '',
].join('\n')

writeFileSync(join(publicDir, 'sitemap.xml'), sitemap, 'utf8')
writeFileSync(join(publicDir, 'robots.txt'), robots, 'utf8')
console.log(`Generated ${getSeoRoutes().length} sitemap URLs`)
