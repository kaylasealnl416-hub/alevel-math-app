// 章节知识点质量分析脚本
import { SUBJECTS } from './data-import/subjects.js';

const issues = {
  critical: [],
  medium: [],
  low: []
};

function analyzeKeyPoints(subject, book, chapter) {
  const keyPoints = chapter.keyPoints || [];
  const chapterRef = `${subject.name.en} > ${book.title.en} > ${chapter.title.en} (${chapter.id})`;

  // 1. 检查知识点数量
  if (keyPoints.length < 35) {
    issues.critical.push({
      chapter: chapterRef,
      issue: `Only ${keyPoints.length} key points (expected 35-50)`,
      type: 'Insufficient content'
    });
  } else if (keyPoints.length > 50) {
    issues.low.push({
      chapter: chapterRef,
      issue: `${keyPoints.length} key points (expected 35-50, may be too verbose)`,
      type: 'Excessive content'
    });
  }

  // 2. 检查重复内容
  const duplicates = findDuplicates(keyPoints);
  if (duplicates.length > 0) {
    issues.medium.push({
      chapter: chapterRef,
      issue: `Duplicate key points found: ${duplicates.join('; ')}`,
      type: 'Duplicate content'
    });
  }

  // 3. 检查空白或过短的知识点
  keyPoints.forEach((point, idx) => {
    if (!point || point.trim().length < 10) {
      issues.critical.push({
        chapter: chapterRef,
        issue: `Key point #${idx + 1} is empty or too short: "${point}"`,
        type: 'Invalid content'
      });
    }
  });

  // 4. 检查语法问题（基础检查）
  keyPoints.forEach((point, idx) => {
    // 检查是否以小写字母开头（除非是专有名词）
    if (point && /^[a-z]/.test(point) && !point.startsWith('e.g.') && !point.startsWith('i.e.')) {
      issues.low.push({
        chapter: chapterRef,
        issue: `Key point #${idx + 1} starts with lowercase: "${point.substring(0, 50)}..."`,
        type: 'Formatting issue'
      });
    }

    // 检查是否有中文字符（应该全英文）
    if (point && /[\u4e00-\u9fa5]/.test(point)) {
      issues.critical.push({
        chapter: chapterRef,
        issue: `Key point #${idx + 1} contains Chinese characters: "${point.substring(0, 50)}..."`,
        type: 'Language issue'
      });
    }

    // 检查是否过长（可能需要拆分）
    if (point && point.length > 300) {
      issues.low.push({
        chapter: chapterRef,
        issue: `Key point #${idx + 1} is very long (${point.length} chars, consider splitting)`,
        type: 'Formatting issue'
      });
    }
  });

  // 5. 检查内容质量标记
  const hasExamples = keyPoints.some(p => p.includes('EXAMPLE') || p.includes('Example') || p.includes('e.g.'));
  const hasFormulas = keyPoints.some(p => p.includes('=') || p.includes('formula') || p.includes('Formula'));
  const hasRealWorld = keyPoints.some(p => p.includes('REAL-WORLD') || p.includes('Real-world'));

  if (!hasExamples && chapter.difficulty !== 'Foundation') {
    issues.low.push({
      chapter: chapterRef,
      issue: 'No examples found in key points (consider adding practical examples)',
      type: 'Content suggestion'
    });
  }
}

function findDuplicates(arr) {
  const seen = new Map();
  const duplicates = [];

  arr.forEach((item, idx) => {
    const normalized = item.toLowerCase().trim();
    if (seen.has(normalized)) {
      duplicates.push(`"${item.substring(0, 40)}..." (indices ${seen.get(normalized)}, ${idx})`);
    } else {
      seen.set(normalized, idx);
    }
  });

  return duplicates;
}

function analyzeSubject(subjectKey) {
  const subject = SUBJECTS[subjectKey];
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📚 Analyzing: ${subject.name.en}`);
  console.log(`${'='.repeat(80)}`);

  let totalChapters = 0;
  let totalKeyPoints = 0;

  Object.values(subject.books).forEach(book => {
    book.chapters.forEach(chapter => {
      totalChapters++;
      totalKeyPoints += (chapter.keyPoints || []).length;
      analyzeKeyPoints(subject, book, chapter);
    });
  });

  console.log(`Total chapters: ${totalChapters}`);
  console.log(`Total key points: ${totalKeyPoints}`);
  console.log(`Average key points per chapter: ${(totalKeyPoints / totalChapters).toFixed(1)}`);
}

// 主分析流程
console.log('🔍 A-Level Math App - Chapter Quality Analysis');
console.log('='.repeat(80));

const subjects = ['economics', 'psychology', 'history', 'politics', 'furtherMathematics'];

subjects.forEach(subjectKey => {
  if (SUBJECTS[subjectKey]) {
    analyzeSubject(subjectKey);
  } else {
    console.log(`\n⚠️  Subject "${subjectKey}" not found in SUBJECTS data`);
  }
});

// 输出问题报告
console.log('\n\n');
console.log('='.repeat(80));
console.log('📊 QUALITY REPORT');
console.log('='.repeat(80));

console.log(`\n🔴 CRITICAL ISSUES (${issues.critical.length}):`);
if (issues.critical.length === 0) {
  console.log('   ✅ No critical issues found!');
} else {
  issues.critical.forEach((issue, idx) => {
    console.log(`\n${idx + 1}. ${issue.chapter}`);
    console.log(`   Type: ${issue.type}`);
    console.log(`   Issue: ${issue.issue}`);
  });
}

console.log(`\n🟡 MEDIUM PRIORITY ISSUES (${issues.medium.length}):`);
if (issues.medium.length === 0) {
  console.log('   ✅ No medium priority issues found!');
} else {
  issues.medium.slice(0, 20).forEach((issue, idx) => {
    console.log(`\n${idx + 1}. ${issue.chapter}`);
    console.log(`   Type: ${issue.type}`);
    console.log(`   Issue: ${issue.issue}`);
  });
  if (issues.medium.length > 20) {
    console.log(`\n   ... and ${issues.medium.length - 20} more medium priority issues`);
  }
}

console.log(`\n🟢 LOW PRIORITY SUGGESTIONS (${issues.low.length}):`);
if (issues.low.length === 0) {
  console.log('   ✅ No suggestions!');
} else {
  issues.low.slice(0, 10).forEach((issue, idx) => {
    console.log(`\n${idx + 1}. ${issue.chapter}`);
    console.log(`   Type: ${issue.type}`);
    console.log(`   Issue: ${issue.issue}`);
  });
  if (issues.low.length > 10) {
    console.log(`\n   ... and ${issues.low.length - 10} more suggestions`);
  }
}

console.log('\n\n');
console.log('='.repeat(80));
console.log('📈 SUMMARY');
console.log('='.repeat(80));
console.log(`Total issues found: ${issues.critical.length + issues.medium.length + issues.low.length}`);
console.log(`  🔴 Critical: ${issues.critical.length}`);
console.log(`  🟡 Medium: ${issues.medium.length}`);
console.log(`  🟢 Low: ${issues.low.length}`);

if (issues.critical.length === 0 && issues.medium.length === 0) {
  console.log('\n✅ Overall quality: EXCELLENT - Ready for production!');
} else if (issues.critical.length === 0) {
  console.log('\n✅ Overall quality: GOOD - Minor improvements recommended');
} else if (issues.critical.length < 10) {
  console.log('\n⚠️  Overall quality: FAIR - Some critical issues need attention');
} else {
  console.log('\n❌ Overall quality: NEEDS WORK - Multiple critical issues found');
}

console.log('\n');
