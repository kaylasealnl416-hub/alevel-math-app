# 源码重构计划：拆分 4735 行主文件

## 当前文件结构分析

```
alevel-math-app.jsx (4735 行)
├── 1. 工具函数 (~20行)
│   └── parseAIResponse
├── 2. MathText 组件 (~35行)
├── 3. 课程数据 CURRICULUM (~1565行)
│   └── P1-P4, S1, M1 数学内容
├── 4. 其他数据 (~50行)
│   ├── ALL_SUBJECTS
│   ├── PAST_PAPERS
│   └── SUBJECT_RESOURCES
├── 5. 本地化函数 (~60行)
│   ├── toEn, titleEn
│   ├── CHAPTER_EN
│   └── localiseChapter
├── 6. API 存储函数 (~125行)
│   └── getApiKey, saveApiKey 等
├── 7. 翻译 T (~115行)
│   └── 中英文翻译
├── 8. 视图组件 (~1340行)
│   ├── HomeView
│   ├── SubjectsView
│   ├── CurriculumView
│   ├── ChapterView
│   ├── QuizView
│   ├── ExamView
│   ├── MockExamView
│   ├── ErrorBookView
│   └── LoadingSpinner
├── 9. 样式 (~490行)
│   └── styles 对象 + styleEl
└── 10. 主应用 ALevelMathApp (~620行)
```

---

## 拆分方案

### 目标目录结构

```
src/
├── components/
│   ├── MathText.jsx           # 现有，已提取
│   ├── ErrorBoundary.jsx      # 现有，已提取
│   ├── LoadingSpinner.jsx     # 现有，已提取
│   │
│   ├── views/                         # 新增：视图组件
│   │   ├── HomeView.jsx
│   │   ├── SubjectsView.jsx
│   │   ├── CurriculumView.jsx
│   │   ├── ChapterView.jsx
│   │   ├── QuizView.jsx
│   │   ├── ExamView.jsx
│   │   ├── MockExamView.jsx
│   │   └── ErrorBookView.jsx
│   │
│   └── layout/
│       └── NavBar.jsx                # 新增：导航栏
│
├── data/                             # 新增：数据模块
│   ├── curriculum.js           # CURRICULUM 数据
│   ├── subjects.js            # 现有 SUBJECTS 数据
│   ├── pastPapers.js         # PAST_PAPERS 数据
│   └── resources.js          # SUBJECT_RESOURCES 数据
│
├── i18n/                             # 新增：国际化
│   ├── translations.js        # T 翻译对象
│   ├── index.js
│   └── useLocale.js           # Hook: 语言切换
│
├── utils/                            # 现有，已部分提取
│   ├── api.js                # 现有，已提取
│   ├── constants.js          # 现有，已提取
│   ├── validation.js         # 现有，已提取
│   └── aiParser.js           # 新增：parseAIResponse
│
├── hooks/                            # 现有，已部分提取
│   ├── useLocalStorage.js     # 现有，已提取
│   ├── useErrorBook.js        # 现有，已提取
│   └── useLanguage.js         # 现有，已提取
│
├── styles/
│   └── theme.js               # 新增：样式主题
│
├── App.jsx                     # 新增：主应用入口
├── main.jsx                    # 现有，已修改
└── alevel-math-app.jsx        # 删除：拆分后移除
```

---

## 拆分步骤 (按依赖顺序)

### 步骤 1: 提取数据和常量 (基础层)
- [ ] `src/data/curriculum.js` - 提取 CURRICULUM
- [ ] `src/data/pastPapers.js` - 提取 PAST_PAPERS
- [ ] `src/data/resources.js` - 提取 SUBJECT_RESOURCES

### 步骤 2: 提取国际化 (i18n)
- [ ] `src/i18n/translations.js` - 提取 T 翻译对象
- [ ] `src/i18n/locale.js` - 提取本地化函数 (toEn, titleEn, CHAPTER_EN, localiseChapter)

### 步骤 3: 提取工具函数
- [ ] `src/utils/aiParser.js` - 提取 parseAIResponse
- [ ] 整合现有的 api.js (包含 API 存储函数)

### 步骤 4: 提取样式
- [ ] `src/styles/theme.js` - 提取 styles 对象

### 步骤 5: 提取视图组件
- [ ] `src/components/views/HomeView.jsx`
- [ ] `src/components/views/SubjectsView.jsx`
- [ ] `src/components/views/CurriculumView.jsx`
- [ ] `src/components/views/ChapterView.jsx`
- [ ] `src/components/views/QuizView.jsx`
- [ ] `src/components/views/ExamView.jsx`
- [ ] `src/components/views/MockExamView.jsx`
- [ ] `src/components/views/ErrorBookView.jsx`

### 步骤 6: 创建主应用入口
- [ ] `src/App.jsx` - 重构 ALevelMathApp，整合所有模块

### 步骤 7: 更新入口文件
- [ ] `src/main.jsx` - 更新导入路径

---

## 依赖关系图

```
main.jsx
    └── App.jsx
          ├── components/
          │   ├── ErrorBoundary.jsx
          │   ├── views/
          │   │   ├── HomeView.jsx
          │   │   ├── SubjectsView.jsx
          │   │   ├── CurriculumView.jsx
          │   │   ├── ChapterView.jsx
          │   │   ├── QuizView.jsx
          │   │   ├── ExamView.jsx
          │   │   ├── MockExamView.jsx
          │   │   └── ErrorBookView.jsx
          │   └── MathText.jsx
          ├── data/
          │   ├── curriculum.js
          │   ├── subjects.js
          │   ├── pastPapers.js
          │   └── resources.js
          ├── i18n/
          │   ├── translations.js
          │   └── locale.js
          ├── utils/
          │   ├── api.js
          │   ├── aiParser.js
          │   ├── constants.js
          │   └── validation.js
          ├── hooks/
          │   ├── useLocalStorage.js
          │   ├── useErrorBook.js
          │   └── useLanguage.js
          └── styles/
              └── theme.js
```

---

## 风险控制

### 拆分原则
1. **逐步拆分** - 每拆分一个模块立即测试
2. **保持功能不变** - 不改变任何业务逻辑
3. **导入路径一致** - 拆分后模块可正常导入

### 验证步骤
每次拆分完成后执行：
```bash
npm run lint    # ESLint 检查
npm test        # 测试通过
npm run build   # 构建成功
curl localhost:3000  # 功能正常
```

---

## 时间估算

| 步骤 | 工作内容 | 预估行数 | 复杂度 |
|------|----------|----------|--------|
| 1 | 数据提取 | ~1600行 | 低 |
| 2 | 国际化 | ~180行 | 低 |
| 3 | 工具函数 | ~150行 | 低 |
| 4 | 样式 | ~490行 | 中 |
| 5 | 视图组件 | ~1340行 | 高 |
| 6 | 主应用 | ~620行 | 高 |
| 7 | 入口更新 | ~10行 | 低 |

**总计**: ~4400行代码重构

---

## 执行策略

1. **顺序执行** - 按上述步骤顺序进行
2. **测试驱动** - 每步完成后立即验证
3. **提交节点** - 每个视图组件拆分为一个提交
4. **不推送** - 本地完成后再决定是否推送
