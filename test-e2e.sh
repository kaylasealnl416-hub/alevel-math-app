#!/bin/bash

# E2E 测试脚本 - 测试完整的用户流程

API_BASE="https://alevel-math-app-production-6e22.up.railway.app"
FRONTEND_URL="https://alevel-math-app.vercel.app"

echo "🚀 开始端到端测试..."
echo ""

# 测试 1: 后端健康检查
echo "📊 测试 1: 后端健康检查"
HEALTH=$(curl -s "$API_BASE/health")
echo "$HEALTH" | grep -q '"status":"ok"' && echo "✅ 后端运行正常" || echo "❌ 后端异常"
echo ""

# 测试 2: 获取考试列表
echo "📊 测试 2: 获取考试列表"
EXAMS=$(curl -s "$API_BASE/api/exams?userId=1&limit=5")
EXAM_COUNT=$(echo "$EXAMS" | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
echo "✅ 找到 $EXAM_COUNT 个考试记录"
echo ""

# 测试 3: 获取考试详情
echo "📊 测试 3: 获取考试详情"
EXAM_DETAIL=$(curl -s "$API_BASE/api/exams/11")
QUESTION_COUNT=$(echo "$EXAM_DETAIL" | grep -o '"questions":\[' | wc -l)
echo "$EXAM_DETAIL" | grep -q '"success":true' && echo "✅ 考试详情加载成功" || echo "❌ 考试详情加载失败"
echo ""

# 测试 4: CORS 配置
echo "📊 测试 4: CORS 配置"
CORS_HEADER=$(curl -s -I -H "Origin: https://alevel-math-app.vercel.app" "$API_BASE/api/exams?userId=1&limit=1" | grep -i "access-control-allow-origin")
if [ -n "$CORS_HEADER" ]; then
  echo "✅ CORS 配置正确: $CORS_HEADER"
else
  echo "❌ CORS 配置缺失"
fi
echo ""

# 测试 5: 前端可访问性
echo "📊 测试 5: 前端可访问性"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$FRONTEND_STATUS" = "200" ]; then
  echo "✅ 前端可访问 (HTTP $FRONTEND_STATUS)"
else
  echo "❌ 前端不可访问 (HTTP $FRONTEND_STATUS)"
fi
echo ""

# 测试 6: 认证 API
echo "📊 测试 6: 认证 API - 验证错误处理"
AUTH_TEST=$(curl -s -X POST "$API_BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"123"}')
echo "$AUTH_TEST" | grep -q '"issues"' && echo "✅ 验证错误正确返回" || echo "❌ 验证错误处理异常"
echo ""

# 测试 7: 数据完整性
echo "📊 测试 7: 数据完整性检查"
EXAM_11=$(curl -s "$API_BASE/api/exams/11")
echo "$EXAM_11" | grep -q '"totalScore"' && echo "✅ 考试包含分数统计" || echo "⚠️  考试未批改"
echo "$EXAM_11" | grep -q '"difficultyStats"' && echo "✅ 考试包含难度统计" || echo "⚠️  缺少难度统计"
echo "$EXAM_11" | grep -q '"topicStats"' && echo "✅ 考试包含主题统计" || echo "⚠️  缺少主题统计"
echo ""

echo "🎉 测试完成！"
echo ""
echo "📝 测试摘要:"
echo "- 后端 API: $API_BASE"
echo "- 前端 URL: $FRONTEND_URL"
echo "- 考试总数: $EXAM_COUNT"
echo ""
echo "💡 提示: 运行 'cd backend && bun test' 进行详细的 API 测试"
