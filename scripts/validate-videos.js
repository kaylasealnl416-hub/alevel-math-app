#!/usr/bin/env node
// ============================================================
// Video URL Validator
// 验证 subjects.js 中所有 YouTube 视频链接的有效性
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// YouTube ID 验证正则 (11位字符)
const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

// 提取视频 ID
function extractVideoId(url) {
  const match = url.match(/watch\?v=([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// 验证视频 ID
function isValidVideoId(videoId) {
  return YOUTUBE_ID_REGEX.test(videoId);
}

// 主函数
function validateVideos() {
  const rootDir = path.join(__dirname, '..');
  const subjectsPath = path.join(rootDir, 'src/data/subjects.js');
  const content = fs.readFileSync(subjectsPath, 'utf-8');

  const results = {
    valid: [],
    invalid: [],
    short: [],
    total: 0
  };

  // 匹配所有 YouTube URL
  const urlRegex = /url:\s*"([^"]*youtube[^"]*)"/g;
  let match;

  while ((match = urlRegex.exec(content)) !== null) {
    const url = match[1];
    const videoId = extractVideoId(url);

    results.total++;

    if (!videoId) {
      results.invalid.push({ url, reason: 'Cannot extract video ID' });
    } else if (!isValidVideoId(videoId)) {
      results.short.push({ url, videoId, length: videoId.length });
    } else {
      results.valid.push({ url, videoId });
    }
  }

  // 输出报告
  console.log('\n=== YouTube Video URL Validation Report ===\n');
  console.log(`Total URLs found: ${results.total}`);
  console.log(`Valid (11 chars): ${results.valid.length}`);
  console.log(`Invalid (< 11 chars): ${results.short.length}`);
  console.log(`Parse Error: ${results.invalid.length}`);

  if (results.short.length > 0) {
    console.log('\n=== Invalid Video IDs (not 11 characters) ===\n');
    results.short.forEach((item, i) => {
      console.log(`${i + 1}. ID: "${item.videoId}" (${item.length} chars)`);
      console.log(`   URL: ${item.url}`);
    });
  }

  if (results.invalid.length > 0) {
    console.log('\n=== Parse Errors ===\n');
    results.invalid.forEach((item, i) => {
      console.log(`${i + 1}. ${item.reason}: ${item.url}`);
    });
  }

  // 输出有效的视频 ID 列表
  if (results.valid.length > 0) {
    console.log('\n=== Valid Video IDs (for reference) ===\n');
    results.valid.forEach((item, i) => {
      console.log(`${i + 1}. ${item.videoId}`);
    });
  }

  return results;
}

// 导出为 Markdown 报告
function exportMarkdownReport(results) {
  const report = `# YouTube Video Validation Report

Generated: ${new Date().toISOString()}

## Summary

| Status | Count |
|--------|-------|
| Total URLs | ${results.total} |
| Valid | ${results.valid.length} |
| Invalid | ${results.short.length} |
| Parse Error | ${results.invalid.length} |

## Invalid Video IDs

${results.short.length > 0 ? results.short.map((item, i) =>
  `${i + 1}. \`${item.videoId}\` (${item.length} chars)\n   - ${item.url}`
).join('\n\n') : 'None'}

## Valid Video IDs (needs real content)

${results.valid.length > 0 ? results.valid.map((item, i) =>
  `${i + 1}. \`${item.videoId}\` - needs verification`
).join('\n') : 'None'}

## Next Steps

1. Replace invalid IDs with real YouTube video IDs
2. Verify valid IDs point to correct content
3. Consider using YouTube Data API for automated validation

---

**Note**: YouTube video IDs must be exactly 11 characters.
`.trim();

  const reportPath = path.join(__dirname, '..', 'VIDEO_VALIDATION_REPORT.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\nReport saved to: ${reportPath}`);
}

// 运行
const results = validateVideos();
exportMarkdownReport(results);
