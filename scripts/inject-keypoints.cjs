const fs = require('fs');
const path = require('path');

// 读取所有 confirmed JSON
const dir = path.join(__dirname, '../docs/keypoints-confirmed');
const files = ['p1-confirmed.json','p2-confirmed.json','s1-confirmed.json','p3-confirmed.json','p4-confirmed.json','m1-confirmed.json'];

const allChapters = {};
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  for (const ch of data) {
    allChapters[ch.id] = ch.keyPoints;
  }
}
console.log('Loaded chapters:', Object.keys(allChapters).length);

const srcPath = path.join(__dirname, '../src/data/curriculum.js');
let src = fs.readFileSync(srcPath, 'utf8');

let replaced = 0;

for (const [id, keyPoints] of Object.entries(allChapters)) {
  // 找到 id 的位置
  const idIndex = src.indexOf(`id: "${id}"`);
  if (idIndex === -1) { console.warn('id not found:', id); continue; }

  // 从 id 位置往后找 keyPoints: [
  const kpLabel = 'keyPoints: [';
  const kpStart = src.indexOf(kpLabel, idIndex);
  if (kpStart === -1) { console.warn('keyPoints not found for:', id); continue; }

  // 从 [ 开始计数找配对的 ]，跳过字符串内容
  const bracketStart = kpStart + kpLabel.length - 1; // 指向 [
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

  // 构建新的 keyPoints 内容
  const indent = '          ';
  const newItems = keyPoints.map(kp => `${indent}{ en: ${JSON.stringify(kp)} }`).join(',\n');
  const newBlock = `keyPoints: [\n${newItems}\n        ]`;

  // 替换旧的 keyPoints: [...] 整块
  src = src.slice(0, kpStart) + newBlock + src.slice(kpEnd + 1);
  replaced++;
}

fs.writeFileSync(srcPath, src, 'utf8');
console.log('Done. Chapters replaced:', replaced, '/ 47');
