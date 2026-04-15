/**
 * 注入 Further Math 12章 keyPoints 到 subjects.js
 * 数据来源：docs/keypoints-confirmed/further-math-confirmed.json
 */

const fs = require('fs');
const path = require('path');

const confirmedPath = path.join(__dirname, '../docs/keypoints-confirmed/further-math-confirmed.json');
const subjectsPath = path.join(__dirname, '../src/data/subjects.js');

const confirmed = JSON.parse(fs.readFileSync(confirmedPath, 'utf-8'));
let content = fs.readFileSync(subjectsPath, 'utf-8');

let replaced = 0;

for (const chapter of confirmed) {
  const { id, keyPoints } = chapter;
  const keyPointsStr = JSON.stringify(keyPoints, null, 14)
    .replace(/^\[/, '[')
    .replace(/\]$/, ']');

  // 匹配 id: "xxx" 后紧接的 keyPoints: [...] 块
  const regex = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?keyPoints:\\s*)\\[[\\s\\S]*?\\](?=\\s*,)`,
    'm'
  );

  if (regex.test(content)) {
    content = content.replace(regex, `$1${keyPointsStr}`);
    replaced++;
    console.log(`✅ ${id} 已替换`);
  } else {
    console.warn(`⚠️  ${id} 未找到匹配，跳过`);
  }
}

fs.writeFileSync(subjectsPath, content, 'utf-8');
console.log(`\n完成：${replaced}/${confirmed.length} 章已写入 subjects.js`);
