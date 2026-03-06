# A-Level Mathematics App — 启动说明

## 第一步：安装 Node.js（只需一次）

1. 打开浏览器，访问 https://nodejs.org
2. 点击绿色的 **"LTS"** 按钮下载安装包
3. 双击安装，一路点 Next 即可
4. 安装完成后**重启电脑**

---

## 第二步：启动应用

**Windows 用户：**
1. 在本文件夹里，右键点击空白处
2. 选择「在终端中打开」（或「Open in Terminal」）
3. 复制粘贴以下两条命令（每条粘贴后按回车）：

```
npm install
npm run dev
```

**Mac 用户：**
1. 打开「访达（Finder）」，找到本文件夹
2. 右键文件夹 → 选择「新建位于文件夹位置的终端窗口」
3. 复制粘贴：

```
npm install
npm run dev
```

---

## 第三步：使用应用

- 第一次运行 `npm install` 会下载依赖（约需 1 分钟，仅需一次）
- 之后每次只需运行 `npm run dev`
- 浏览器会**自动打开** http://localhost:3000
- 关闭应用：在终端按 **Ctrl + C**

---

## 常见问题

**问：AI 功能（练习题/考试）没有反应？**
答：AI 功能需要 Anthropic API Key。在应用内设置，或联系提供方获取。

**问：`npm` 命令找不到？**
答：确认 Node.js 安装完成后重启了电脑。

**问：端口 3000 被占用？**
答：修改 `vite.config.js` 中的 `port: 3000` 改为其他数字，如 `3001`。

---

*应用文件：`src/alevel-math-app.jsx`*
