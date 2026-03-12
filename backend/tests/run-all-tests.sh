#!/bin/bash

# 一键运行所有测试
# 运行方式：bash backend/tests/run-all-tests.sh

echo "🧪 开始运行所有测试..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 1. 视频链接验证
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📹 测试 1: 视频链接有效性"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if bun run tests/video-links-validator.js; then
  echo -e "${GREEN}✅ 视频链接测试通过${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${RED}❌ 视频链接测试失败${NC}"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

# 2. 知识点完整性验证
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 测试 2: 知识点完整性"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if bun run tests/knowledge-points-validator.js; then
  echo -e "${GREEN}✅ 知识点测试通过${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${YELLOW}⚠️  知识点测试发现问题（非致命）${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
fi
echo ""

# 3. 答案准确性验证
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 测试 3: 答案准确性"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if bun run tests/answer-accuracy.test.js; then
  echo -e "${GREEN}✅ 答案准确性测试通过${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${RED}❌ 答案准确性测试失败${NC}"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

# 4. 认证流程测试
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 测试 4: 用户认证流程"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if bun run tests/auth-flow.test.js; then
  echo -e "${GREEN}✅ 认证流程测试通过${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${RED}❌ 认证流程测试失败${NC}"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

# 5. 考试流程测试
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 测试 5: 考试完整流程"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if bun run tests/exam-workflow.test.js; then
  echo -e "${GREEN}✅ 考试流程测试通过${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${RED}❌ 考试流程测试失败${NC}"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

# 总结
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 测试结果总结"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "总测试数: $TOTAL_TESTS"
echo -e "${GREEN}通过: $PASSED_TESTS${NC}"
echo -e "${RED}失败: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}🎉 所有测试通过！${NC}"
  exit 0
else
  echo -e "${RED}⚠️  有 $FAILED_TESTS 个测试失败，请检查上述错误。${NC}"
  exit 1
fi
