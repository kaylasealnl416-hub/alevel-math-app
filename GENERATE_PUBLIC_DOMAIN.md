# 🌐 生成公开域名

## ❌ `railway.internal` 不是公开地址

`alevel-math-app.railway.internal` 是 Railway 内部网络地址，只能在 Railway 内部服务之间访问，外部无法访问。

---

## ✅ 你需要生成公开域名

在 **Networking** 页面中，应该有一个部分叫：

```
┌─────────────────────────────────────┐
│ Public Networking                    │
│                                      │
│ 或者叫 "Domains"                     │
├─────────────────────────────────────┤
│                                      │
│ [+ Generate Domain] 按钮             │  ← 找到并点击这个
│                                      │
└─────────────────────────────────────┘
```

---

## 📍 具体步骤

1. **在 Networking 页面中向下滚动**
2. **找到 "Public Networking" 或 "Domains" 部分**
3. **点击 "Generate Domain" 按钮**
4. Railway 会生成一个公开 URL，格式：
   ```
   https://alevel-math-app-production-xxxx.up.railway.app
   ```
5. **复制这个 URL 给我**

---

## 🔍 如果找不到 "Generate Domain" 按钮

可能需要先配置 **Root Directory**：

1. 在右侧菜单点击 **"Source"**
2. 找到 **"Root Directory"** 设置
3. 输入：`backend`
4. 保存
5. 等待重新部署（1-2分钟）
6. 再回到 **"Networking"** 查看

---

## 📸 或者截图给我看

如果还是找不到，截图整个 Networking 页面给我看，我会告诉你具体在哪里。

---

**找到 Generate Domain 按钮了吗？** 🎯
