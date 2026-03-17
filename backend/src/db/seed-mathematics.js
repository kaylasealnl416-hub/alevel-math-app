/**
 * Seed mathematics subject into the database
 * Data extracted from src/alevel-math-app.jsx
 */
import { db } from './index.js'
import * as schema from './schema.js'
import { eq } from 'drizzle-orm'

const SUBJECT_ID = 'mathematics'

const UNITS = [
  { id: 'P1', title: { en: 'Pure Mathematics 1', zh: 'Pure Mathematics 1' }, subtitle: { en: 'WMA11', zh: 'WMA11' }, color: '#DA291C', order: 1 },
  { id: 'P2', title: { en: 'Pure Mathematics 2', zh: 'Pure Mathematics 2' }, subtitle: { en: 'WMA12', zh: 'WMA12' }, color: '#C62828', order: 2 },
  { id: 'S1', title: { en: 'Statistics 1', zh: 'Statistics 1' }, subtitle: { en: 'WST01', zh: 'WST01' }, color: '#1565C0', order: 3 },
  { id: 'P3', title: { en: 'Pure Mathematics 3', zh: 'Pure Mathematics 3' }, subtitle: { en: 'WMA13', zh: 'WMA13' }, color: '#AD1457', order: 4 },
  { id: 'P4', title: { en: 'Pure Mathematics 4', zh: 'Pure Mathematics 4' }, subtitle: { en: 'WMA14', zh: 'WMA14' }, color: '#6A1B9A', order: 5 },
  { id: 'M1', title: { en: 'Mechanics 1', zh: 'Mechanics 1' }, subtitle: { en: 'WME01', zh: 'WME01' }, color: '#00695C', order: 6 },
]

const CHAPTERS = {
  P1: [
    { id: 'math_p1c1', num: 1, title: 'Algebraic Expressions' },
    { id: 'math_p1c2', num: 2, title: 'Quadratics' },
    { id: 'math_p1c3', num: 3, title: 'Equations & Inequalities' },
    { id: 'math_p1c4', num: 4, title: 'Graphs & Transformations' },
    { id: 'math_p1c5', num: 5, title: 'Straight Line Geometry' },
    { id: 'math_p1c6', num: 6, title: 'Trigonometric Ratios' },
    { id: 'math_p1c7', num: 7, title: 'Radians' },
    { id: 'math_p1c8', num: 8, title: 'Differentiation' },
    { id: 'math_p1c9', num: 9, title: 'Integration' },
  ],
  P2: [
    { id: 'math_p2c1', num: 1, title: 'Algebraic Methods' },
    { id: 'math_p2c2', num: 2, title: 'Coordinate Geometry: Circles' },
    { id: 'math_p2c3', num: 3, title: 'Exponentials & Logarithms' },
    { id: 'math_p2c4', num: 4, title: 'Binomial Expansion' },
    { id: 'math_p2c5', num: 5, title: 'Sequences & Series' },
    { id: 'math_p2c6', num: 6, title: 'Trigonometric Identities' },
    { id: 'math_p2c7', num: 7, title: 'Further Differentiation' },
    { id: 'math_p2c8', num: 8, title: 'Further Integration' },
  ],
  S1: [
    { id: 'math_s1c1', num: 1, title: 'Mathematical Modelling' },
    { id: 'math_s1c2', num: 2, title: 'Measures of Location & Spread' },
    { id: 'math_s1c3', num: 3, title: 'Representations of Data' },
    { id: 'math_s1c4', num: 4, title: 'Probability' },
    { id: 'math_s1c5', num: 5, title: 'Correlation & Regression' },
    { id: 'math_s1c6', num: 6, title: 'Discrete Random Variables' },
    { id: 'math_s1c7', num: 7, title: 'Normal Distribution' },
  ],
  P3: [
    { id: 'math_p3c1', num: 1, title: 'Further Algebraic Methods' },
    { id: 'math_p3c2', num: 2, title: 'Functions' },
    { id: 'math_p3c3', num: 3, title: 'Further Trigonometry' },
    { id: 'math_p3c4', num: 4, title: 'Further Exponentials & Logarithms' },
    { id: 'math_p3c5', num: 5, title: 'Advanced Differentiation' },
    { id: 'math_p3c6', num: 6, title: 'Advanced Integration' },
    { id: 'math_p3c7', num: 7, title: 'Vectors' },
    { id: 'math_p3c8', num: 8, title: 'Differential Equations' },
  ],
  P4: [
    { id: 'math_p4c1', num: 1, title: 'Proof by Mathematical Induction' },
    { id: 'math_p4c2', num: 2, title: 'Complex Numbers' },
    { id: 'math_p4c3', num: 3, title: 'Matrices' },
    { id: 'math_p4c4', num: 4, title: 'Further Vectors' },
    { id: 'math_p4c5', num: 5, title: 'Hyperbolic Functions' },
    { id: 'math_p4c6', num: 6, title: 'Polar Coordinates' },
    { id: 'math_p4c7', num: 7, title: 'Further Calculus' },
    { id: 'math_p4c8', num: 8, title: 'Second-Order Differential Equations' },
  ],
  M1: [
    { id: 'math_m1c1', num: 1, title: 'Mathematical Models & Kinematics' },
    { id: 'math_m1c2', num: 2, title: 'Dynamics of a Particle' },
    { id: 'math_m1c3', num: 3, title: 'Forces & Equilibrium' },
    { id: 'math_m1c4', num: 4, title: 'Moments' },
    { id: 'math_m1c5', num: 5, title: 'Work, Energy & Power' },
    { id: 'math_m1c6', num: 6, title: 'Impulse & Momentum' },
    { id: 'math_m1c7', num: 7, title: 'Projectile Motion' },
  ],
}

async function seed() {
  console.log('🌱 Seeding mathematics subject...')

  // Check if already exists
  const existing = await db.select().from(schema.subjects).where(eq(schema.subjects.id, SUBJECT_ID))
  if (existing.length > 0) {
    console.log('⚠️  Mathematics already exists in DB. Skipping.')
    process.exit(0)
  }

  // Insert subject
  await db.insert(schema.subjects).values({
    id: SUBJECT_ID,
    name: { en: 'Mathematics', zh: '数学' },
    nameFull: { en: 'Pearson Edexcel IAL Mathematics', zh: '爱德思IAL数学' },
    icon: '∫',
    color: '#DA291C',
    bgColor: '#FEF2F2',
    level: 'A-Level',
  })
  console.log('✅ Subject inserted')

  // Insert units + chapters
  for (const unit of UNITS) {
    const uniqueUnitId = `${SUBJECT_ID}_${unit.id}`

    await db.insert(schema.units).values({
      id: uniqueUnitId,
      subjectId: SUBJECT_ID,
      title: unit.title,
      subtitle: unit.subtitle,
      color: unit.color,
      order: unit.order,
    })
    console.log(`  📖 Unit inserted: ${unit.title.en} (${uniqueUnitId})`)

    const chapters = CHAPTERS[unit.id] || []
    for (const ch of chapters) {
      await db.insert(schema.chapters).values({
        id: ch.id,
        unitId: uniqueUnitId,
        num: ch.num,
        title: { en: ch.title, zh: ch.title },
        overview: null,
        keyPoints: null,
        formulas: null,
        examples: null,
        videos: null,
        order: ch.num,
      })
    }
    console.log(`     ✅ ${chapters.length} chapters inserted`)
  }

  const total = Object.values(CHAPTERS).reduce((sum, arr) => sum + arr.length, 0)
  console.log(`\n✅ Done: 1 subject, ${UNITS.length} units, ${total} chapters`)
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
