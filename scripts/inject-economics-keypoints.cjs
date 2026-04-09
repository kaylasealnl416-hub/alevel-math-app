const fs = require('fs');
const path = require('path');

// 读取经济学 confirmed JSON
const dir = path.join(__dirname, '../docs/keypoints-confirmed');
const files = ['economics-u1u2-confirmed.json', 'economics-u3u4-confirmed.json'];

const allChapters = {};
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  for (const ch of data) {
    allChapters[ch.id] = ch.keyPoints;
  }
}
console.log('Loaded chapters:', Object.keys(allChapters).length);

const srcPath = path.join(__dirname, '../src/data/subjects.js');
let src = fs.readFileSync(srcPath, 'utf8');

let replaced = 0;

for (const [id, keyPoints] of Object.entries(allChapters)) {
  const idIndex = src.indexOf(`id: "${id}"`);
  if (idIndex === -1) { console.warn('id not found:', id); continue; }

  const kpLabel = 'keyPoints: [';
  const kpStart = src.indexOf(kpLabel, idIndex);
  if (kpStart === -1) { console.warn('keyPoints not found for:', id); continue; }

  // 括号计数，跳过字符串内容
  const bracketStart = kpStart + kpLabel.length - 1;
  let depth = 0;
  let inString = false;
  let escape = false;
  let kpEnd = -1;

  for (let i = bracketStart; i < src.length; i++) {
    const c = src[i];
    if (escape) { escape = false; continue; }
    if (c === '\\' && inString) { escape = true; continue; }
    if (c === '"' && !inString) { inString = true; continue; }
    if (c === '"' && inString) { inString = false; continue; }
    if (inString) continue;
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) { kpEnd = i; break; }
    }
  }

  if (kpEnd === -1) { console.warn('closing ] not found for:', id); continue; }

  // 纯字符串数组（不需要 {en:} 包装）
  const indent = '              ';
  const newItems = keyPoints.map(kp => `${indent}${JSON.stringify(kp)}`).join(',\n');
  const newBlock = `keyPoints: [\n${newItems}\n            ]`;

  src = src.slice(0, kpStart) + newBlock + src.slice(kpEnd + 1);
  replaced++;
  console.log('Replaced:', id);
}

fs.writeFileSync(srcPath, src, 'utf8');
console.log('Done. Chapters replaced:', replaced, '/ 23');
