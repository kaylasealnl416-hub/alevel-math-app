# Chapter Data Schema

## Data File Locations

| File | Purpose | Video field |
|------|---------|-------------|
| `src/data/subjects.js` | Frontend React app (source of truth) | `youtube:` |
| `backend/data-import/subjects.js` | Backend database import | `videos:` |

**Important**: These two files must be kept in sync manually. The frontend reads `src/data/subjects.js` directly as static data — it does NOT call a backend API. The backend file uses `videos:` because the database schema expects that field name.

## Field Types

### Required Fields
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique chapter identifier (e.g. `e1c1`, `psy2c3`) |
| num | number | Chapter number within unit |
| title | object or string | `{zh, en}` bilingual title |

### Optional Fields
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| overview | object | `{}` | `{zh, en}` bilingual overview |
| keyPoints | array | `[]` | Key learning points (English) |
| formulas | array | `[]` | Mathematical/theoretical formulas |
| examples | array | `[]` | Example questions `{question: {zh,en}, answer: {zh,en}}` |
| youtube | array | `[]` | Video resources `{title, channel, url}` |
| difficulty | string | `"Intermediate"` | `Foundation` / `Intermediate` / `Advanced` |
| hardPoints | string | `""` | High-frequency mistakes / difficult points |
| examTips | string | `""` | Exam strategy and scoring tips |
| definitions | array | `[]` | Term definitions `{term, definition}` — used in History chapters, not yet rendered in UI |

### Language Policy

- **title, overview**: Bilingual `{zh, en}` objects
- **keyPoints, hardPoints, examTips**: English only
- **UI**: All interface text is English-only (no language toggle)

## Subject Field Coverage (as of 2026-03-16)

| Subject | keyPoints | formulas | examples | youtube | definitions |
|---------|-----------|----------|----------|---------|-------------|
| economics | ✅ | ✅ | ✅ | ✅ | ❌ |
| history | ✅ | ✅ | ⚠️ partial | ✅ | ✅ (not rendered) |
| politics | ✅ | ⚠️ partial | ⚠️ partial | ✅ | ❌ |
| psychology | ✅ | ❌ | ⚠️ partial | ✅ | ❌ |
| further_math | ✅ | ✅ | ❌ | ✅ | ❌ |

## Content Volume (as of 2026-03-16)

| Subject | Chapters | Total Key Points | Avg per Chapter |
|---------|----------|-----------------|-----------------|
| Economics | 25 | ~750 | ~30 |
| History | 18 | ~540 | ~30 |
| Politics | 11 | ~330 | ~30 |
| Psychology | 14 | ~420 | ~30 |
| Further Math | 12 | ~450 | ~38 |
| **Total** | **82** | **~2,490** | **~30** |

## Defensive Coding Rules

Always guard optional fields in UI:
```jsx
{(chapter.youtube || []).map(...)}     // videos tab - MUST use || []
{(ch.keyPoints || []).map(...)}        // already guarded
{ch.examples?.length > 0 && ...}      // examples section
{ch.examTips && ...}                  // examTips section
```

## Future Improvements

### ID Naming Convention

Current naming is inconsistent for Further Math:
- `fm1c1` — should be `fp1c1` (FP1 = Further Pure 1)
- `fm2c1` — should be `fp2c1` (FP2 = Further Pure 2)
- `fmech1c1` — acceptable
- `fs1c1` — acceptable

Note: Changing IDs is a breaking change — affects bookmarks, error book, saved progress.

### Definitions Field

History chapters have `definitions:` data that is not yet rendered in the UI. Could be added as a glossary tab or inline in the learn tab.
