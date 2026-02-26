# A-Level 多学科应用 - 新增学科设计方案

## 一、整体架构（扩展版）

```
┌─────────────────────────────────────────────────────────────────────┐
│  A-Level Learning Hub          [API Key ⚙️]     [🌐 EN/中文]        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐      │
│  │                 │    │                 │    │             │      │
│  │   📐 MATHEMATICS │    │  📊 ECONOMICS   │    │ 🔬 FURTHER   │      │
│  │   (数学)          │    │   (经济学)       │    │  MATH        │      │
│  │                 │    │                 │    │  (进阶数学)   │      │
│  │  P1  P2  P3  P4 │    │  U1  U2  U3  U4 │    │  FP1 FP2    │      │
│  │  S1  M1         │    │                 │    │  FM1 FM2    │      │
│  │                 │    │                 │    │  FS1 FS2    │      │
│  └─────────────────┘    └─────────────────┘    └─────────────┘      │
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐                        │
│  │                 │    │                 │                        │
│  │   📜 HISTORY    │    │   ⚖️ POLITICS   │                        │
│  │   (历史)         │    │   (政治)         │                        │
│  │  AS1 AS2       │    │  AS1 AS2       │                        │
│  │  A21 A22       │    │  A21 A22       │                        │
│  │                 │    │                 │                        │
│  └─────────────────┘    └─────────────────┘                        │
│                                                                     │
│  ┌─────────────────┐                                               │
│  │                 │                                               │
│  │   🧠 PSYCHOLOGY │                                               │
│  │   (心理学)       │                                               │
│  │  AS1 AS2       │                                               │
│  │  A21 A22       │                                               │
│  │                 │                                               │
│  └─────────────────┘                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 二、新增学科课程结构

### 1. Further Mathematics (进阶数学) - FP1, FP2, FM1, FM2, FS1, FS2

**Pearson Edexcel IAL Further Mathematics 单元：**
- **FP1 (Further Pure 1)**: 复数、矩阵、极坐标、归纳法
- **FP2 (Further Pure 2)**: 双曲函数、微分方程、坐标几何
- **FM1 (Further Mechanics 1)**: 动量、碰撞、能量功
- **FM2 (Further Mechanics 2)**: 圆周运动、弹性
- **FS1 (Further Statistics 1)**: 连续概率分布
- **FS2 (Further Statistics 2)**: 假设检验、卡方检验

### 2. History (历史) - AS/A2 两级

**Pearson Edexcel IAL History 单元：**
- **Unit 1**: Breadth Study - Themes in modern international history (1789-1945)
- **Unit 2**: Depth Study - The USA 1918-1968
- **Unit 3**: Thematic Study with Sources - The British Empire c. 1855-1967
- **Unit 4**: Historical Investigation - Studentchosen topic

### 3. Politics (政治) - AS/A2 两级

**Pearson Edexcel IAL Politics 单元：**
- **Unit 1**: UK Politics & Core Political Ideas (Democracy, Parliament, Elections)
- **Unit 2**: UK Government & Non-core Ideas (UK Constitution, Liberalism, Socialism)
- **Unit 3**: Comparative Politics - The USA (Federalism, Congress, Presidency)
- **Unit 4**: Global Politics (Globalisation, Regional organisations, Human Rights)

### 4. Psychology (心理学) - AS/A2 两级

**Pearson Edexcel IAL Psychology 单元：**
- **Unit 1**: Social Psychology, Cognitive Psychology, Research Methods
- **Unit 2**: Biological Psychology, Learning Theories, Developmental Psychology
- **Unit 3**: Applications of Psychology - Clinical, Criminal, Health
- **Unit 4**: Debates in Psychology, Advanced Research Methods

## 三、技术架构

```
src/
├── data/
│   ├── subjects.js         # 包含所有学科 (数学+经济+新增4个)
│   ├── mathematics.js     # 数学 (现有)
│   ├── economics.js       # 经济 (现有)
│   ├── further-math.js    # 进阶数学
│   ├── history.js        # 历史
│   ├── politics.js        # 政治
│   └── psychology.js      # 心理学
```

## 四、数据结构设计

```javascript
// 统一学科数据结构
const ALL_SUBJECTS = {
  mathematics: {
    id: "mathematics",
    name: { zh: "数学", en: "Mathematics" },
    icon: "📐",
    color: "#DA291C",
    level: "IAL",
    books: { P1: {...}, P2: {...}, S1: {...}, M1: {...} }
  },
  economics: {
    id: "economics",
    name: { zh: "经济学", en: "Economics" },
    icon: "📊",
    color: "#1E88E5",
    level: "IAL",
    books: { Unit1: {...}, Unit2: {...}, Unit3: {...}, Unit4: {...} }
  },
  "further-math": {
    id: "further-math",
    name: { zh: "进阶数学", en: "Further Mathematics" },
    icon: "🔬",
    color: "#7B1FA2",
    level: "IAL",
    books: { FP1: {...}, FP2: {...}, FM1: {...}, FM2: {...}, FS1: {...}, FS2: {...} }
  },
  history: {
    id: "history",
    name: { zh: "历史", en: "History" },
    icon: "📜",
    color: "#8D6E63",
    level: "IAL",
    books: { Unit1: {...}, Unit2: {...}, Unit3: {...}, Unit4: {...} }
  },
  politics: {
    id: "politics",
    name: { zh: "政治", en: "Politics" },
    icon: "⚖️",
    color: "#455A64",
    level: "IAL",
    books: { Unit1: {...}, Unit2: {...}, Unit3: {...}, Unit4: {...} }
  },
  psychology: {
    id: "psychology",
    name: { zh: "心理学", en: "Psychology" },
    icon: "🧠",
    color: "#00897B",
    level: "IAL",
    books: { Unit1: {...}, Unit2: {...}, Unit3: {...}, Unit4: {...} }
  }
};
```

## 五、每章节数据结构

```javascript
{
  id: "fp1c1", num: 1,
  title: { zh: "复数", en: "Complex Numbers" },
  overview: { zh: "...", en: "..." },
  // 核心要点
  keyPoints: [
    "i² = -1 定义",
    "复数模与幅角",
    "De Moivre定理",
    ...
  ],
  // 公式/公理/定义
  formulas: [
    { name: "复数乘法", expr: "z₁z₂ = r₁r₂(cos(θ₁+θ₂) + i sin(θ₁+θ₂))" },
    ...
  ],
  // 定义
  definitions: [
    { term: "纯虚数", definition: "实部为0的复数" },
    ...
  ],
  // 难点
  hardPoints: "...",
  // 考试技巧
  examTips: "...",
  // 例题
  examples: [
    {
      question: { zh: "...", en: "..." },
      answer: { zh: "...", en: "..." }
    }
  ],
  // YouTube视频
  youtube: [
    { title: "...", channel: "...", url: "..." }
  ],
  difficulty: "Intermediate"
}
```

## 六、不同学科的Learn内容差异

| 学科 | KeyPoints | Formulas | Definitions | YouTube |
|------|------------|----------|------------|---------|
| Further Math | ✓ | ✓ (数学公式) | ✓ | 数学视频 |
| History | ✓ (历史事件) | ✗ | ✓ (历史概念) | 历史纪录片 |
| Politics | ✓ (政治理论) | ✗ | ✓ (政治术语) | 政治分析 |
| Psychology | ✓ (心理学理论) | ✗ | ✓ (心理学术语) | 心理学讲座 |

## 七、开发优先级

1. **第一阶段**: 创建数据文件，添加新学科到选择页面
2. **第二阶段**: Curriculum页面支持所有学科
3. **第三阶段**: Quiz/Exam/Mock生成对应学科的AI题目
4. **第四阶段**: 添加YouTube视频链接

---

请确认以上设计是否符合您的预期，确认后我将继续进行开发。
