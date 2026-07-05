import { CURRICULUM } from '../data/curriculum.js'
import { SUBJECTS } from '../data/subjects.js'
import { ALL_SUBJECTS, PAST_PAPERS_BY_SUBJECT } from '../data/allSubjects.js'
import { SUBJECT_RESOURCES } from '../data/subjectResources.js'

export const SITE_URL = 'https://alevel-math-app.vercel.app'
export const SITE_NAME = 'A-Level Hub'
export const DEFAULT_DESCRIPTION = 'A Pearson Edexcel International A-Level study hub with Mathematics, Physics and Economics syllabus guides, worked examples, videos and official past paper links.'

const SUBJECT_SUMMARIES = {
  mathematics: 'Study Pearson Edexcel IAL Mathematics through Pure Mathematics, Statistics and Mechanics units. Each chapter includes core concepts, formula reminders, worked examples and exam-focused revision notes.',
  physics: 'Study Pearson Edexcel IAL Physics by unit, including mechanics, materials, waves, electricity, fields, thermodynamics, radiation, practical skills and exam-focused revision resources.',
  economics: 'Study Pearson Edexcel IAL Economics with structured unit guides covering markets, macroeconomic performance, business behaviour and the global economy, aligned to the international specification.',
  further_math: 'Study Further Mathematics topics with structured advanced pure, statistics and mechanics chapters for deeper Pearson Edexcel IAL preparation.',
  history: 'Review A-Level History topics with structured chapter notes and revision resources.',
  politics: 'Review A-Level Politics topics with structured chapter notes and revision resources.',
  psychology: 'Review A-Level Psychology topics with structured chapter notes and revision resources.'
}

export function subjectSlug(subjectId) {
  return String(subjectId).replace(/_/g, '-').toLowerCase()
}

export function normaliseSlug(value) {
  return String(value || '').toLowerCase()
}

export function canonicalUrl(path = '/') {
  const cleanPath = path === '/' ? '/' : '/' + String(path).replace(/^\/+|\/+$/g, '')
  return `${SITE_URL}${cleanPath}`
}

export function textValue(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value.en || value.zh || ''
}

export function truncate(value, max = 155) {
  const clean = String(value || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trim()}...`
}

export function getSubjectsCatalog() {
  const mathSubject = {
    ...ALL_SUBJECTS.mathematics,
    books: CURRICULUM,
  }

  return [mathSubject, ...Object.values(SUBJECTS)].map(subject => {
    const id = subject.id
    const books = Object.entries(subject.books || {}).map(([bookId, book]) => ({
      id: bookId,
      slug: normaliseSlug(bookId),
      title: textValue(book.title) || bookId,
      subtitle: textValue(book.subtitle),
      color: book.color || subject.color || '#1a73e8',
      exam: book.exam || null,
      chapters: (book.chapters || []).map(chapter => ({
        id: chapter.id,
        slug: normaliseSlug(chapter.id),
        num: chapter.num,
        title: textValue(chapter.title) || chapter.id,
        overview: textValue(chapter.overview),
        keyPoints: chapter.keyPoints || [],
        formulas: chapter.formulas || [],
        examples: chapter.examples || [],
        youtube: chapter.youtube || [],
        difficulty: chapter.difficulty || 'Core',
        hardPoints: chapter.hardPoints || '',
        examTips: chapter.examTips || '',
      })),
    }))

    const chapterCount = books.reduce((sum, book) => sum + book.chapters.length, 0)

    return {
      id,
      slug: subjectSlug(id),
      name: textValue(subject.name) || id,
      nameFull: textValue(subject.nameFull) || textValue(subject.name) || id,
      icon: subject.icon || '📚',
      color: subject.color || '#1a73e8',
      level: subject.level || 'IAL',
      summary: SUBJECT_SUMMARIES[id] || `${textValue(subject.name)} study notes and revision resources for A-Level learners.`,
      books,
      chapterCount,
      resources: SUBJECT_RESOURCES[id] || [],
      pastPapers: PAST_PAPERS_BY_SUBJECT[id] || [],
    }
  })
}

export function getSubjectBySlug(slug) {
  return getSubjectsCatalog().find(subject => subject.slug === normaliseSlug(slug) || subject.id === slug)
}

export function getUnitBySlug(subject, unitSlug) {
  if (!subject) return null
  return subject.books.find(book => book.slug === normaliseSlug(unitSlug) || book.id === unitSlug)
}

export function getChapterBySlug(unit, chapterSlug) {
  if (!unit) return null
  return unit.chapters.find(chapter => chapter.slug === normaliseSlug(chapterSlug) || chapter.id === chapterSlug)
}

export function subjectPath(subject) {
  return `/subjects/${subject.slug}`
}

export function unitPath(subject, unit) {
  return `${subjectPath(subject)}/${unit.slug}`
}

export function chapterPath(subject, unit, chapter) {
  return `${unitPath(subject, unit)}/${chapter.slug}`
}

export function getSeoRoutes() {
  const routes = [
    {
      path: '/',
      type: 'home',
      title: 'A-Level Hub - Pearson Edexcel IAL Study Platform',
      description: DEFAULT_DESCRIPTION,
      priority: 1,
    },
    {
      path: '/subjects',
      type: 'subjects',
      title: 'Pearson Edexcel IAL Subjects - A-Level Hub',
      description: 'Explore indexable Pearson Edexcel IAL subject guides for Mathematics, Physics, Economics and supporting A-Level study resources.',
      priority: 0.95,
    },
    {
      path: '/resources/past-papers',
      type: 'past-papers',
      title: 'Pearson Edexcel IAL Past Paper Directory - A-Level Hub',
      description: 'Find official Pearson Edexcel International A-Level past paper search links and exam metadata for Mathematics, Physics and Economics.',
      priority: 0.9,
    },
  ]

  for (const subject of getSubjectsCatalog()) {
    routes.push({
      path: subjectPath(subject),
      type: 'subject',
      subjectId: subject.id,
      title: `${subject.nameFull} Syllabus Guide - A-Level Hub`,
      description: truncate(`${subject.summary} Includes ${subject.chapterCount} chapter guides, unit outlines, revision resources and exam preparation links.`),
      priority: 0.9,
    })

    for (const unit of subject.books) {
      routes.push({
        path: unitPath(subject, unit),
        type: 'unit',
        subjectId: subject.id,
        unitId: unit.id,
        title: `${unit.title} ${unit.exam?.code ? `(${unit.exam.code}) ` : ''}- ${subject.name} Unit Guide`,
        description: truncate(`${unit.title} for ${subject.nameFull}. Review ${unit.chapters.length} chapters, key topics, formulas, examples and exam preparation notes.`),
        priority: 0.82,
      })

      for (const chapter of unit.chapters) {
        routes.push({
          path: chapterPath(subject, unit, chapter),
          type: 'chapter',
          subjectId: subject.id,
          unitId: unit.id,
          chapterId: chapter.id,
          title: `${chapter.title} - ${subject.name} ${unit.id} Revision`,
          description: truncate(chapter.overview || `${chapter.title} revision notes for ${subject.nameFull}, including key points, formulas and exam tips.`),
          priority: 0.72,
        })
      }
    }
  }

  return routes
}

export function buildBreadcrumbJsonLd(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  }
}

export function getPageMeta(path = '/') {
  const route = getSeoRoutes().find(item => item.path === path) || getSeoRoutes()[0]
  return {
    ...route,
    canonical: canonicalUrl(route.path),
    image: `${SITE_URL}/og-default.svg`,
    robots: 'index, follow',
    jsonLd: getJsonLdForRoute(route),
  }
}

export function getJsonLdForRoute(route) {
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: DEFAULT_DESCRIPTION,
      inLanguage: 'en',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
  ]

  if (route.type === 'subjects') {
    graph.push({
      '@type': 'CollectionPage',
      name: route.title,
      url: canonicalUrl(route.path),
      description: route.description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
    })
  }

  if (route.type === 'past-papers') {
    graph.push({
      '@type': 'CollectionPage',
      name: route.title,
      url: canonicalUrl(route.path),
      description: route.description,
      about: 'Pearson Edexcel International A-Level past papers',
      isPartOf: { '@id': `${SITE_URL}/#website` },
    })
  }

  if (route.type === 'subject') {
    const subject = getSubjectsCatalog().find(item => item.id === route.subjectId)
    graph.push({
      '@type': 'Course',
      name: subject?.nameFull || route.title,
      url: canonicalUrl(route.path),
      description: route.description,
      provider: { '@id': `${SITE_URL}/#organization` },
      educationalLevel: 'International Advanced Level',
      teaches: subject?.books.map(book => book.title) || [],
    })
  }

  if (route.type === 'unit' || route.type === 'chapter') {
    const subject = getSubjectsCatalog().find(item => item.id === route.subjectId)
    const unit = subject?.books.find(item => item.id === route.unitId)
    const chapter = unit?.chapters.find(item => item.id === route.chapterId)
    const breadcrumbs = [
      { name: 'Home', path: '/' },
      { name: 'Subjects', path: '/subjects' },
      subject && { name: subject.name, path: subjectPath(subject) },
      unit && { name: unit.title, path: unitPath(subject, unit) },
      chapter && { name: chapter.title, path: chapterPath(subject, unit, chapter) },
    ].filter(Boolean)

    graph.push(buildBreadcrumbJsonLd(breadcrumbs))
    graph.push({
      '@type': route.type === 'chapter' ? 'LearningResource' : 'Course',
      name: route.type === 'chapter' ? chapter?.title || route.title : unit?.title || route.title,
      url: canonicalUrl(route.path),
      description: route.description,
      provider: { '@id': `${SITE_URL}/#organization` },
      educationalLevel: 'International Advanced Level',
      about: subject?.nameFull,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

export function getPastPaperSubjects() {
  return getSubjectsCatalog()
    .map(subject => ({
      subject,
      papers: PAST_PAPERS_BY_SUBJECT[subject.id] || [],
    }))
    .filter(group => group.papers.length > 0)
}
