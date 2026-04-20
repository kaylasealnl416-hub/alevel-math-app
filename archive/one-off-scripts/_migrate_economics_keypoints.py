"""
Economics keyPoints 迁移脚本
将 docs/keypoints-confirmed/economics-confirmed.json 的内容写入 src/data/subjects.js

策略：逐行扫描 + 括号深度计数，安全定位每章的 keyPoints 块
不使用正则，避免字符串内 ] 截断问题
"""

import json
import shutil
import re
import sys

CONFIRMED_PATH = r'docs/keypoints-confirmed/economics-confirmed.json'
SUBJECTS_PATH  = r'src/data/subjects.js'
BACKUP_PATH    = r'src/data/subjects.js.bak'

# ── 1. 读取已确认的 keyPoints ─────────────────────────────────
with open(CONFIRMED_PATH, 'r', encoding='utf-8') as f:
    confirmed = json.load(f)

kp_map = {item['id']: item['keyPoints'] for item in confirmed}
print(f"Loaded {len(kp_map)} Economics chapters")

# ── 2. 读取 subjects.js ───────────────────────────────────────
with open(SUBJECTS_PATH, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"subjects.js: {len(lines)} lines")

# -- 3. Backup -------------------------------------------------
shutil.copy(SUBJECTS_PATH, BACKUP_PATH)
print(f"Backup saved to {BACKUP_PATH}\n")

# ── 4. 逐行扫描并替换 ─────────────────────────────────────────
result  = []
updated = []
i = 0

while i < len(lines):
    line = lines[i]

    # 检查当前行是否包含目标章节 id（精确匹配，如 id: "e1c1"）
    chapter_id = None
    for cid in kp_map:
        if re.search(r'\bid:\s*"' + re.escape(cid) + r'"', line):
            chapter_id = cid
            break

    if chapter_id is None:
        result.append(line)
        i += 1
        continue

    # 找到目标章节，先把 id 行加入结果
    result.append(line)
    i += 1

    # 向前扫描，找 keyPoints: [
    kp_start = None
    while i < len(lines):
        if re.search(r'\bkeyPoints:\s*\[', lines[i]):
            kp_start = i
            break
        result.append(lines[i])
        i += 1

    if kp_start is None:
        print(f"  [WARN] keyPoints not found for {chapter_id}, skipping")
        continue

    # 检测 keyPoints: [ 行的缩进
    kp_line    = lines[kp_start]
    indent_len = len(kp_line) - len(kp_line.lstrip())
    indent     = ' ' * indent_len
    inner      = ' ' * (indent_len + 2)

    # 括号深度计数，定位 keyPoints 块的结束行
    depth = 0
    j = kp_start
    while j < len(lines):
        for ch in lines[j]:
            if ch == '[':
                depth += 1
            elif ch == ']':
                depth -= 1
                if depth == 0:
                    break
        if depth == 0:
            break
        j += 1

    # 检查原块末尾是否有逗号（即 ], 还是 ]）
    end_stripped = lines[j].rstrip()
    trailing_comma = ',' if end_stripped.endswith('],') else ''

    # 构建新的 keyPoints 块（纯字符串格式，与 subjects.js 已有 Economics 格式一致）
    new_kps   = kp_map[chapter_id]
    new_block = [f'{indent}keyPoints: [\n']
    for idx, kp in enumerate(new_kps):
        # 转义字符串内的反斜杠和双引号
        escaped = kp.replace('\\', '\\\\').replace('"', '\\"')
        comma   = ',' if idx < len(new_kps) - 1 else ''
        new_block.append(f'{inner}"{escaped}"{comma}\n')
    new_block.append(f'{indent}]{trailing_comma}\n')

    result.extend(new_block)
    i = j + 1
    updated.append(chapter_id)
    print(f"  [OK] {chapter_id} ({len(new_kps)} items)")

# -- 5. 写回 subjects.js ---------------------------------------
with open(SUBJECTS_PATH, 'w', encoding='utf-8') as f:
    f.writelines(result)

# -- 6. 结果报告 -----------------------------------------------
print(f"\n{'='*50}")
print(f"Done! Updated {len(updated)}/23 chapters")

missing = [cid for cid in kp_map if cid not in updated]
if missing:
    print(f"WARNING - missing chapters: {missing}")
    sys.exit(1)
else:
    print("SUCCESS: All 23 Economics chapters written to subjects.js")
