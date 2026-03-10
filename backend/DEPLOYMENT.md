# 部署指南

## 生产环境部署清单

### 1. 环境变量配置

必需的环境变量：
```bash
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key-min-32-chars
```

可选的环境变量：
```bash
PORT=4000
NODE_ENV=production
ZHIPU_API_KEY=your-zhipu-api-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### 2. 数据库准备

```bash
# 1. 执行数据库迁移
bun run db:migrate

# 2. 验证表结构
bun run db:studio

# 3. 初始化测试数据（可选）
bun run seed-test-data.js
```

### 3. 生产环境检查

```bash
# 运行完整的生产环境检查
node check-production.js

# 检查环境变量
node check-env.js
```

### 4. 启动服务

```bash
# 开发环境
bun run dev

# 生产环境
bun run start
```

### 5. 健康检查

服务启动后，访问以下端点验证：

```bash
# 健康检查
curl http://localhost:4000/health

# 预期响应
{
  "status": "ok",
  "timestamp": "2026-03-10T...",
  "version": "1.0.0",
  "uptime": 123.456
}
```

## 性能优化

### 已实现的优化

1. **响应缓存**
   - 科目和章节数据缓存 10 分钟
   - 自动清理过期缓存

2. **安全加固**
   - 安全响应头（XSS、CSRF 防护）
   - 请求大小限制（5MB）
   - Rate limiting（15分钟100次请求）

3. **性能监控**
   - 请求响应时间追踪
   - 慢请求警告（>1秒）
   - 数据库查询监控

### 监控端点

开发环境下可访问：
```bash
GET /api/stats
```

返回性能统计信息。

## 安全建议

1. **生产环境必须**：
   - 使用 HTTPS
   - 设置强密码的 JWT_SECRET（至少 32 字符）
   - 配置正确的 CORS_ORIGIN
   - 定期更新依赖包

2. **数据库安全**：
   - 使用连接池
   - 启用 SSL 连接
   - 定期备份数据

3. **API 安全**：
   - 所有敏感端点需要认证
   - 实施 rate limiting
   - 记录异常访问

## 故障排查

### 数据库连接失败

```bash
# 检查 DATABASE_URL 格式
echo $DATABASE_URL

# 测试数据库连接
bun run db:test
```

### 端口被占用

```bash
# Windows
netstat -ano | findstr :4000

# 修改端口
export PORT=4001
```

### 内存泄漏

监控内存使用：
```bash
# 查看进程内存
ps aux | grep node

# 使用 PM2 管理进程
pm2 start src/index.js --name alevel-backend
pm2 monit
```

## 扩展性

### 水平扩展

1. 使用负载均衡器（Nginx/HAProxy）
2. 多实例部署
3. 共享 Redis 缓存（替代内存缓存）

### 垂直扩展

1. 增加服务器资源
2. 优化数据库查询
3. 启用 CDN 加速静态资源

## 备份策略

### 数据库备份

```bash
# 每日自动备份
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 恢复备份
psql $DATABASE_URL < backup_20260310.sql
```

### 代码备份

- 使用 Git 版本控制
- 定期推送到远程仓库
- 标记重要版本（Git tags）

## 更新部署

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装依赖
bun install

# 3. 运行迁移
bun run db:migrate

# 4. 重启服务
pm2 restart alevel-backend
```

## 监控和日志

### 推荐工具

- **应用监控**：PM2, New Relic
- **日志管理**：Winston, Pino
- **错误追踪**：Sentry
- **性能分析**：Clinic.js

### 日志级别

- `ERROR`: 错误和异常
- `WARN`: 警告（慢查询、高内存使用）
- `INFO`: 重要事件（启动、关闭）
- `DEBUG`: 调试信息（仅开发环境）
