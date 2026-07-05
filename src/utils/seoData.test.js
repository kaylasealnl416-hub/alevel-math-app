import { describe, expect, it } from 'vitest'
import {
  canonicalUrl,
  chapterPath,
  getChapterBySlug,
  getPageMeta,
  getSeoRoutes,
  getSubjectBySlug,
  getSubjectsCatalog,
  getUnitBySlug,
  unitPath,
} from './seoData.js'

describe('SEO data', () => {
  it('generates unique canonical routes for public indexable pages', () => {
    const routes = getSeoRoutes()
    const paths = routes.map(route => route.path)

    expect(paths).toContain('/')
    expect(paths).toContain('/subjects')
    expect(paths).toContain('/resources/past-papers')
    expect(paths).toContain('/subjects/physics')
    expect(paths).toContain('/subjects/physics/unit1/phy1c1')
    expect(new Set(paths).size).toBe(paths.length)
    expect(routes.every(route => route.path.startsWith('/'))).toBe(true)
  })

  it('maps clean URL slugs back to subject, unit and chapter data', () => {
    const physics = getSubjectBySlug('physics')
    const unit1 = getUnitBySlug(physics, 'unit1')
    const chapter = getChapterBySlug(unit1, 'phy1c1')

    expect(physics.name).toBe('Physics')
    expect(unitPath(physics, unit1)).toBe('/subjects/physics/unit1')
    expect(chapter.title).toContain('Motion')
    expect(chapterPath(physics, unit1, chapter)).toBe('/subjects/physics/unit1/phy1c1')
  })

  it('creates metadata with absolute canonical URLs and JSON-LD', () => {
    const meta = getPageMeta('/subjects/mathematics/p1/p1c1')

    expect(meta.canonical).toBe(canonicalUrl('/subjects/mathematics/p1/p1c1'))
    expect(meta.robots).toBe('index, follow')
    expect(meta.title).toContain('Revision')
    expect(meta.description.length).toBeGreaterThan(40)
    expect(meta.jsonLd['@context']).toBe('https://schema.org')
    expect(meta.jsonLd['@graph'].some(item => item['@type'] === 'BreadcrumbList')).toBe(true)
  })

  it('covers every catalog chapter with one SEO route', () => {
    const chapterCount = getSubjectsCatalog().reduce(
      (total, subject) => total + subject.books.reduce((sum, unit) => sum + unit.chapters.length, 0),
      0,
    )
    const routeChapterCount = getSeoRoutes().filter(route => route.type === 'chapter').length

    expect(routeChapterCount).toBe(chapterCount)
  })
})
