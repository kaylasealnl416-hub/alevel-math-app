# Chapter Data Schema

## Field Types

### Required Fields (必须字段)
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique chapter identifier |
| num | number | Chapter number |
| title | string | Chapter title |

### Optional Fields (可选字段)
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| overview | object | {} | {zh, en} bilingual overview |
| keyPoints | array | [] | Key learning points (English only) |
| formulas | array | [] | Mathematical formulas |
| examples | array | [] | Example questions |
| youtube | array | [] | Video resources |
| difficulty | string | "Intermediate" | Foundation/Intermediate/Advanced |
| hardPoints | string | "" | Difficult points |
| examTips | string | "" | Exam tips |

### Language Note

- **overview**: Bilingual {zh, en} object
- **keyPoints**: English only (current design decision)
- **UI**: Shows note "Content in English" for keyPoints section

## Validation Rules

1. All required fields must be present
2. Optional fields default to empty array/object if undefined
3. UI must handle undefined optional fields gracefully

## Subject Field Coverage

| Subject | keyPoints | formulas | examples | youtube |
|---------|-----------|----------|----------|---------|
| economics | ✅ | ✅ | ✅ | ✅ |
| history | ✅ | ✅ | ⚠️ (UI handles) | ✅ |
| politics | ✅ | ⚠️ partial | ⚠️ (UI handles) | ✅ |
| psychology | ✅ | ❌ | ⚠️ (UI handles) | ✅ |
| further_math | ✅ | ✅ | ❌ | ✅ |

## Best Practice

- Always use defensive coding in UI: `{chapter.examples?.length > 0 && ...}`
- Data layer can leave optional fields as undefined
- Tests validate defensive handling

## Future Improvements

### ID Naming Convention

Current naming is inconsistent:
- `fm1c1` - should be `fp1c1` (FP1 = Further Pure 1)
- `fm2c1` - should be `fp2c1` (FP2 = Further Pure 2)
- `fmech1c1` - acceptable (FM1 = Further Mechanics 1)
- `fs1c1` - should be `fp3c1` or keep `fs1c1` (FS1 = Further Statistics 1)

Recommendation: Standardize to `fp1c*`, `fp2c*`, `fmech1c*`, `fs1c*` or `fp3c*`, `fmech2c*`, etc.

Note: Changing IDs is a breaking change - affects bookmarks, error book, etc.
