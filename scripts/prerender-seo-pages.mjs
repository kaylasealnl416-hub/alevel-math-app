import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { canonicalUrl, getPageMeta, getSeoRoutes, SITE_NAME } from '../src/utils/seoData.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')
const templatePath = join(distDir, 'index.html')

function escapeAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

function stripSeoHead(html) {
  return html
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name="description"[^>]*>/gi, '')
    .replace(/\s*<meta\s+name="robots"[^>]*>/gi, '')
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/\s*<meta\s+property="og:[^"]+"[^>]*>/gi, '')
    .replace(/\s*<meta\s+name="twitter:[^"]+"[^>]*>/gi, '')
    .replace(/\s*<script\s+type="application\/ld\+json"\s+id="structured-data">[\s\S]*?<\/script>/gi, '')
}

function stripSeoFallback(html) {
  return html.replace(/\s*<noscript\s+id="seo-fallback">[\s\S]*?<\/noscript>/i, '')
}

function headTags(meta) {
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="robots" content="${escapeAttr(meta.robots || 'index, follow')}" />`,
    `<link rel="canonical" href="${escapeAttr(meta.canonical)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(meta.canonical)}" />`,
    `<meta property="og:image" content="${escapeAttr(meta.image)}" />`,
    '<meta name="twitter:card" content="summary" />',
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<script type="application/ld+json" id="structured-data">${safeJson(meta.jsonLd)}</script>`,
  ].join('\n    ')
}

function fallback(route, meta) {
  const subjectLink = route.path === '/subjects' ? canonicalUrl('/subjects') : canonicalUrl('/subjects')
  return [
    '<noscript id="seo-fallback">',
    '  <main style="max-width: 920px; margin: 40px auto; padding: 24px; font-family: Arial, sans-serif; color: #202124; line-height: 1.6;">',
    `    <h1>${escapeHtml(meta.title)}</h1>`,
    `    <p>${escapeHtml(meta.description)}</p>`,
    `    <p><a href="${escapeAttr(subjectLink)}">Browse all Pearson Edexcel IAL subject guides</a></p>`,
    '  </main>',
    '</noscript>',
  ].join('\n')
}

function renderPage(template, route) {
  const meta = getPageMeta(route.path)
  let html = stripSeoFallback(stripSeoHead(template))
  html = html.replace(/<head>/i, `<head>\n    ${headTags(meta)}`)
  html = html.replace(/<body>/i, `<body>\n${fallback(route, meta)}`)
  return html
}

function routeOutputPath(routePath) {
  if (routePath === '/') return templatePath
  const segments = routePath.replace(/^\/+|\/+$/g, '').split('/')
  return join(distDir, ...segments, 'index.html')
}

function routeHtmlOutputPath(routePath) {
  if (routePath === '/') return templatePath
  const segments = routePath.replace(/^\/+|\/+$/g, '').split('/')
  const last = segments.pop()
  return join(distDir, ...segments, `${last}.html`)
}

const template = readFileSync(templatePath, 'utf8')
const routes = getSeoRoutes()

for (const route of routes) {
  const rendered = renderPage(template, route)
  for (const outputPath of new Set([routeOutputPath(route.path), routeHtmlOutputPath(route.path)])) {
    mkdirSync(dirname(outputPath), { recursive: true })
    writeFileSync(outputPath, rendered, 'utf8')
  }
}

console.log(`Prerendered ${routes.length} SEO HTML shells`)
