import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import {
  SITE_NAME,
  canonicalUrl,
  chapterPath,
  getChapterBySlug,
  getPageMeta,
  getPastPaperSubjects,
  getSubjectBySlug,
  getSubjectsCatalog,
  getUnitBySlug,
  subjectPath,
  textValue,
  unitPath,
} from '../../utils/seoData.js'

const pageWrap = {
  minHeight: '100vh',
  background: '#f8f9fa',
  color: '#202124',
}

const inner = {
  maxWidth: 1120,
  margin: '0 auto',
  padding: '36px 24px 64px',
}

const card = {
  background: '#fff',
  border: '1px solid #e8eaed',
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 16,
}

const linkStyle = {
  color: '#1a73e8',
  textDecoration: 'none',
  fontWeight: 600,
}

function upsertMeta(selector, createAttrs, contentAttr, content) {
  if (typeof document === 'undefined') return
  let node = document.head.querySelector(selector)
  if (!node) {
    node = document.createElement('meta')
    Object.entries(createAttrs).forEach(([key, value]) => node.setAttribute(key, value))
    document.head.appendChild(node)
  }
  node.setAttribute(contentAttr, content)
}

function upsertLink(rel, href) {
  if (typeof document === 'undefined') return
  let node = document.head.querySelector(`link[rel="${rel}"]`)
  if (!node) {
    node = document.createElement('link')
    node.setAttribute('rel', rel)
    document.head.appendChild(node)
  }
  node.setAttribute('href', href)
}

function SEOHead({ meta }) {
  useEffect(() => {
    if (!meta || typeof document === 'undefined') return
    document.title = meta.title
    upsertMeta('meta[name="description"]', { name: 'description' }, 'content', meta.description)
    upsertMeta('meta[name="robots"]', { name: 'robots' }, 'content', meta.robots || 'index, follow')
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, 'content', meta.title)
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, 'content', meta.description)
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, 'content', meta.canonical)
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'content', 'website')
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'content', 'summary')
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, 'content', meta.title)
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, 'content', meta.description)
    upsertLink('canonical', meta.canonical)

    let script = document.getElementById('structured-data')
    if (!script) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'structured-data'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(meta.jsonLd)
  }, [meta])

  return null
}

function Hero({ title, description, eyebrow }) {
  return (
    <section style={{ ...card, padding: '34px 32px', marginBottom: 24, borderTop: '4px solid #1a73e8' }}>
      {eyebrow && <p style={{ margin: '0 0 10px', color: '#1a73e8', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>{eyebrow}</p>}
      <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(30px, 5vw, 48px)', lineHeight: 1.08, letterSpacing: -1.2 }}>{title}</h1>
      <p style={{ margin: 0, maxWidth: 780, color: '#5f6368', fontSize: 17, lineHeight: 1.7 }}>{description}</p>
    </section>
  )
}

function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" style={{ fontSize: 13, marginBottom: 18, color: '#5f6368' }}>
      {items.map((item, index) => (
        <span key={item.path}>
          {index > 0 && <span style={{ margin: '0 8px', color: '#9aa0a6' }}>/</span>}
          {index === items.length - 1 ? <span>{item.name}</span> : <Link to={item.path} style={linkStyle}>{item.name}</Link>}
        </span>
      ))}
    </nav>
  )
}

function NotFoundPage() {
  const meta = getPageMeta('/subjects')
  return (
    <div style={pageWrap}>
      <SEOHead meta={meta} />
      <main style={inner}>
        <Hero title="Study guide not found" description="Use the subject directory to find Pearson Edexcel IAL syllabus pages, unit guides and chapter revision notes." />
        <Link to="/subjects" style={linkStyle}>Open subject directory</Link>
      </main>
    </div>
  )
}

export function SubjectsSeoPage() {
  const meta = getPageMeta('/subjects')
  const subjects = getSubjectsCatalog()
  return (
    <div style={pageWrap}>
      <SEOHead meta={meta} />
      <main style={inner}>
        <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Subjects', path: '/subjects' }]} />
        <Hero
          eyebrow="Pearson Edexcel IAL"
          title="A-Level subject syllabus guides"
          description="Browse structured, indexable study guides for Pearson Edexcel International A-Level subjects. Each subject links to unit pages, chapter revision notes, worked examples, videos and official past paper resources."
        />
        <section style={grid}>
          {subjects.map(subject => (
            <Link key={subject.id} to={subjectPath(subject)} style={{ ...card, display: 'block', textDecoration: 'none', color: 'inherit', borderTop: `4px solid ${subject.color}` }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 22 }}>{subject.name}</h2>
              <p style={{ margin: '0 0 14px', color: '#5f6368', lineHeight: 1.6 }}>{subject.summary}</p>
              <p style={{ margin: 0, color: '#1a73e8', fontWeight: 700 }}>{subject.books.length} units / {subject.chapterCount} chapters</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  )
}

export function SubjectSeoPage() {
  const { subjectSlug } = useParams()
  const subject = getSubjectBySlug(subjectSlug)
  if (!subject) return <NotFoundPage />
  const meta = getPageMeta(subjectPath(subject))

  return (
    <div style={pageWrap}>
      <SEOHead meta={meta} />
      <main style={inner}>
        <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Subjects', path: '/subjects' }, { name: subject.name, path: subjectPath(subject) }]} />
        <Hero eyebrow={subject.level} title={`${subject.nameFull} syllabus guide`} description={meta.description} />

        <section style={{ ...card, marginBottom: 20 }}>
          <h2 style={{ marginTop: 0 }}>Units and chapters</h2>
          <div style={grid}>
            {subject.books.map(unit => (
              <Link key={unit.id} to={unitPath(subject, unit)} style={{ padding: 18, border: '1px solid #e8eaed', borderRadius: 12, textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <h3 style={{ margin: '0 0 6px', color: subject.color }}>{unit.title}</h3>
                <p style={{ margin: '0 0 10px', color: '#5f6368' }}>{unit.subtitle || unit.exam?.code || unit.id}</p>
                <p style={{ margin: 0, fontSize: 13, color: '#202124', fontWeight: 700 }}>{unit.chapters.length} chapters</p>
              </Link>
            ))}
          </div>
        </section>

        {subject.resources.length > 0 && (
          <section style={card}>
            <h2 style={{ marginTop: 0 }}>Official and revision resources</h2>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              {subject.resources.map(resource => (
                <li key={resource.url}><a href={resource.url} style={linkStyle} target="_blank" rel="noopener noreferrer">{resource.name}</a> - {resource.desc}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}

export function UnitSeoPage() {
  const { subjectSlug, unitSlug } = useParams()
  const subject = getSubjectBySlug(subjectSlug)
  const unit = getUnitBySlug(subject, unitSlug)
  if (!subject || !unit) return <NotFoundPage />
  const meta = getPageMeta(unitPath(subject, unit))

  return (
    <div style={pageWrap}>
      <SEOHead meta={meta} />
      <main style={inner}>
        <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Subjects', path: '/subjects' }, { name: subject.name, path: subjectPath(subject) }, { name: unit.title, path: unitPath(subject, unit) }]} />
        <Hero eyebrow={unit.exam?.code || unit.id} title={unit.title} description={meta.description} />

        <section style={card}>
          <h2 style={{ marginTop: 0 }}>Chapter revision notes</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {unit.chapters.map(chapter => (
              <Link key={chapter.id} to={chapterPath(subject, unit, chapter)} style={{ padding: 18, border: '1px solid #e8eaed', borderRadius: 12, textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <h3 style={{ margin: '0 0 8px' }}>Chapter {chapter.num}: {chapter.title}</h3>
                <p style={{ margin: '0 0 10px', color: '#5f6368', lineHeight: 1.6 }}>{chapter.overview}</p>
                <p style={{ margin: 0, color: '#1a73e8', fontWeight: 700 }}>{chapter.keyPoints.length} key points / {chapter.formulas.length} formulas</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export function ChapterSeoPage() {
  const { subjectSlug, unitSlug, chapterSlug } = useParams()
  const subject = getSubjectBySlug(subjectSlug)
  const unit = getUnitBySlug(subject, unitSlug)
  const chapter = getChapterBySlug(unit, chapterSlug)
  if (!subject || !unit || !chapter) return <NotFoundPage />
  const meta = getPageMeta(chapterPath(subject, unit, chapter))

  return (
    <div style={pageWrap}>
      <SEOHead meta={meta} />
      <main style={inner}>
        <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Subjects', path: '/subjects' }, { name: subject.name, path: subjectPath(subject) }, { name: unit.title, path: unitPath(subject, unit) }, { name: chapter.title, path: chapterPath(subject, unit, chapter) }]} />
        <Hero eyebrow={`${subject.name} / ${unit.id} / Chapter ${chapter.num}`} title={chapter.title} description={chapter.overview || meta.description} />

        <section style={{ ...card, marginBottom: 20 }}>
          <h2 style={{ marginTop: 0 }}>Key points</h2>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            {chapter.keyPoints.slice(0, 10).map(point => <li key={point}>{point}</li>)}
          </ul>
        </section>

        {chapter.formulas.length > 0 && (
          <section style={{ ...card, marginBottom: 20 }}>
            <h2 style={{ marginTop: 0 }}>Formula checklist</h2>
            <div style={grid}>
              {chapter.formulas.map(formula => (
                <div key={`${formula.name}-${formula.expr}`} style={{ padding: 16, border: '1px solid #e8eaed', borderRadius: 12 }}>
                  <strong>{formula.name}</strong>
                  <p style={{ margin: '8px 0 0', color: '#5f6368' }}>{formula.expr}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {chapter.examples.length > 0 && (
          <section style={{ ...card, marginBottom: 20 }}>
            <h2 style={{ marginTop: 0 }}>Worked example preview</h2>
            {chapter.examples.slice(0, 2).map((example, index) => (
              <article key={index} style={{ padding: 16, border: '1px solid #e8eaed', borderRadius: 12, marginBottom: 10 }}>
                <h3 style={{ marginTop: 0 }}>Example {index + 1}</h3>
                <p><strong>Question:</strong> {textValue(example.question)}</p>
                <p><strong>Answer:</strong> {textValue(example.answer)}</p>
              </article>
            ))}
          </section>
        )}

        {chapter.youtube.length > 0 && (
          <section style={card}>
            <h2 style={{ marginTop: 0 }}>Video search and resources</h2>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              {chapter.youtube.slice(0, 4).map(video => (
                <li key={video.url}><a href={video.url} style={linkStyle} target="_blank" rel="noopener noreferrer">{video.title}</a> - {video.channel}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}

export function PastPapersDirectoryPage() {
  const meta = getPageMeta('/resources/past-papers')
  const groups = getPastPaperSubjects()
  return (
    <div style={pageWrap}>
      <SEOHead meta={meta} />
      <main style={inner}>
        <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Past paper directory', path: '/resources/past-papers' }]} />
        <Hero
          eyebrow="Official-source links"
          title="Pearson Edexcel IAL past paper directory"
          description="Use this public directory to find official Pearson past paper search links and exam metadata for Mathematics, Physics and Economics. Recent locked papers are linked to Pearson rather than mirrored."
        />
        <section style={{ display: 'grid', gap: 18 }}>
          {groups.map(({ subject, papers }) => (
            <article key={subject.id} style={card}>
              <h2 style={{ marginTop: 0 }}>{subject.name}</h2>
              <div style={grid}>
                {papers.slice(0, 18).map((paper, index) => (
                  <a key={`${paper.code}-${paper.year}-${paper.session}-${index}`} href={paper.sourceUrl || canonicalUrl('/resources/past-papers')} target="_blank" rel="noopener noreferrer" style={{ padding: 16, border: '1px solid #e8eaed', borderRadius: 12, textDecoration: 'none', color: 'inherit' }}>
                    <strong>{paper.code || paper.paper}</strong>
                    <p style={{ margin: '6px 0', color: '#5f6368' }}>{paper.year} {paper.session} - {paper.desc}</p>
                    <p style={{ margin: 0, color: '#1a73e8', fontWeight: 700 }}>{paper.duration} min / {paper.questions} questions</p>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export default function SeoPageRouter() {
  const { subjectSlug, unitSlug, chapterSlug } = useParams()
  if (chapterSlug) return <ChapterSeoPage />
  if (unitSlug) return <UnitSeoPage />
  if (subjectSlug) return <SubjectSeoPage />
  return <SubjectsSeoPage />
}
