# PDF/Word 上传功能 - 部署检查清单

**部署日期**: 2026-03-11
**Git Commit**: db13888
**功能**: PDF/Word 题库上传 + AI 智能提取

---

## ✅ 代码提交状态

- [x] 代码已提交到 Git
- [x] 代码已推送到 GitHub (main 分支)
- [x] Commit: `db13888 - feat: Add PDF/Word question bank upload with AI extraction`

---

## 📋 部署前检查

### 1. 环境变量检查

**Railway 后端需要的环境变量**:
```env
# 已有的环境变量
DATABASE_URL=postgresql://...
JWT_SECRET=your_jwt_secret
ZHIPU_API_KEY=your_api_key
AI_PROVIDER=glm
NODE_ENV=production

# 新增环境变量（可选）
GLM_MODEL=glm-4-plus
GLM_MAX_TOKENS=4096
GLM_TEMPERATURE=0.7
```

**Vercel 前端需要的环境变量**:
```env
VITE_API_BASE_URL=https://alevel-math-app-production-6e22.up.railway.app
```

### 2. 依赖包检查

**新增的后端依赖**:
- [x] `multer@2.1.1` - 文件上传
- [x] `mammoth@1.11.0` - Word 解析
- [x] `pdf.js-extract@0.2.1` - PDF 解析
- [x] `uuid@13.0.0` - UUID 生成

**确认**: 所有依赖已添加到 `backend/package.json`

### 3. 文件系统检查

**临时文件目录**:
- 路径: `backend/uploads/`
- 状态: 代码会自动创建
- 清理: 自动清理 24 小时前的文件

**Railway 注意事项**:
- Railway 使用临时文件系统
- 文件会在容器重启后丢失
- 建议：生产环境使用云存储（S3、OSS）

### 4. 路由检查

**新增路由**:
- [x] `POST /api/questions/upload` - 上传文件
- [x] `GET /api/questions/upload/:uploadId/status` - 查询状态
- [x] `GET /api/questions/upload/:uploadId/result` - 获取结果
- [x] `POST /api/questions/batch` - 批量保存

**前端路由**:
- [x] `/questions/upload` - 上传页面（需要认证）

---

## 🚀 部署步骤

### Step 1: Railway 自动部署

Railway 会自动检测到 GitHub 推送并触发部署：

1. **检查部署状态**
   - 访问 Railway Dashboard
   - 查看最新部署日志
   - 确认构建成功

2. **预期部署时间**
   - 构建时间: ~2-3 分钟
   - 启动时间: ~30 秒

3. **检查部署日志**
   ```
   ✅ Dependencies installed
   ✅ Server starting on port 4000
   ✅ Health check passed
   ```

### Step 2: Vercel 自动部署

Vercel 会自动检测到 GitHub 推送并触发部署：

1. **检查部署状态**
   - 访问 Vercel Dashboard
   - 查看最新部署
   - 确认部署成功

2. **预期部署时间**
   - 构建时间: ~1-2 分钟

3. **检查构建日志**
   ```
   ✅ Build completed
   ✅ Deployment ready
   ```

---

## 🧪 部署后测试

### 1. 后端健康检查

```bash
curl https://alevel-math-app-production-6e22.up.railway.app/health
```

**预期响应**:
```json
{
  "status": "ok",
  "timestamp": "2026-03-11T...",
  "version": "1.0.0",
  "uptime": 123.45
}
```

### 2. 前端访问测试

访问以下 URL：
- 主页: https://alevel-math-app.vercel.app
- 登录: https://alevel-math-app.vercel.app/login
- 上传: https://alevel-math-app.vercel.app/questions/upload

### 3. 上传功能测试

**测试步骤**:
1. 登录系统（student1@test.com / test123）
2. 访问上传页面
3. 上传测试文档（test-questions.txt）
4. 等待 AI 解析
5. 审核题目
6. 批量保存

**预期结果**:
- ✅ 文件上传成功
- ✅ AI 提取题目成功
- ✅ 审核界面正常显示
- ✅ 保存到数据库成功

### 4. API 端点测试

**测试上传接口**:
```bash
# 需要认证 token
curl -X POST \
  https://alevel-math-app-production-6e22.up.railway.app/api/questions/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test-questions.txt"
```

---

## ⚠️ 潜在问题

### 问题 1: 文件上传失败

**可能原因**:
- Railway 请求大小限制
- 网络超时
- 内存不足

**解决方案**:
- 检查 Railway 配置
- 增加超时时间
- 升级 Railway 计划

### 问题 2: AI 提取失败

**可能原因**:
- ZHIPU_API_KEY 未配置
- API 配额用尽
- 网络问题

**解决方案**:
- 检查环境变量
- 查看 API 使用情况
- 检查后端日志

### 问题 3: 临时文件问题

**可能原因**:
- Railway 文件系统限制
- 磁盘空间不足

**解决方案**:
- 确保自动清理正常工作
- 考虑使用云存储

### 问题 4: 内存溢出

**可能原因**:
- 大文件处理
- 并发请求过多

**解决方案**:
- 限制文件大小
- 添加请求队列
- 升级 Railway 计划

---

## 📊 监控指标

### 1. 性能指标

**目标**:
- 上传响应时间: < 2 秒
- AI 提取时间: < 60 秒（10 页）
- 保存响应时间: < 1 秒

### 2. 成功率指标

**目标**:
- 上传成功率: > 95%
- AI 提取成功率: > 90%
- 保存成功率: > 99%

### 3. 成本指标

**预算**:
- AI API 成本: < ¥100/月
- Railway 成本: 免费额度内
- Vercel 成本: 免费额度内

---

## 🔍 故障排查

### 查看 Railway 日志

1. 访问 Railway Dashboard
2. 选择项目
3. 点击 "Deployments"
4. 查看最新部署日志

**关键日志**:
```
📄 开始解析文档: xxx.pdf
✂️  分割文本为多个块...
🤖 调用 AI 提取题目...
✅ 成功提取 X 个题目
```

### 查看 Vercel 日志

1. 访问 Vercel Dashboard
2. 选择项目
3. 点击 "Logs"
4. 查看运行时日志

### 本地调试

如果生产环境有问题，可以本地复现：

```bash
# 后端
cd backend
bun run dev

# 前端
bun run dev
```

---

## 📝 部署后任务

### 立即任务
- [ ] 检查 Railway 部署状态
- [ ] 检查 Vercel 部署状态
- [ ] 测试健康检查接口
- [ ] 测试上传功能
- [ ] 检查错误日志

### 短期任务（1 周内）
- [ ] 监控 API 使用量
- [ ] 收集用户反馈
- [ ] 优化 AI Prompt
- [ ] 添加使用统计

### 长期任务（1 月内）
- [ ] 添加 OCR 支持
- [ ] 实现批量上传
- [ ] 添加历史记录
- [ ] 优化成本

---

## 🎯 成功标准

部署成功的标准：

1. ✅ Railway 后端正常运行
2. ✅ Vercel 前端正常访问
3. ✅ 健康检查接口返回 200
4. ✅ 用户可以登录
5. ✅ 上传页面正常显示
6. ✅ 文件上传成功
7. ✅ AI 提取正常工作
8. ✅ 题目保存成功
9. ✅ 无严重错误日志
10. ✅ 响应时间在预期范围内

---

## 📞 联系信息

**部署问题**:
- Railway: https://railway.app/dashboard
- Vercel: https://vercel.com/dashboard
- GitHub: https://github.com/kaylasealnl416-hub/alevel-math-app

**技术支持**:
- 查看文档: `docs/question-upload-quick-guide.md`
- 查看实现报告: `docs/question-upload-implementation-report.md`

---

## ✅ 部署检查清单

### 部署前
- [x] 代码已提交
- [x] 代码已推送
- [ ] 环境变量已配置
- [ ] 依赖包已确认

### 部署中
- [ ] Railway 部署触发
- [ ] Vercel 部署触发
- [ ] 构建日志正常
- [ ] 部署成功

### 部署后
- [ ] 健康检查通过
- [ ] 前端可访问
- [ ] 上传功能测试通过
- [ ] 无严重错误

---

**检查清单创建**: Claude Opus 4.6
**最后更新**: 2026-03-11
**Git Commit**: db13888
