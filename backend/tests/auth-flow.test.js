/**
 * 用户认证流程测试
 * 测试注册、登录、Token 验证
 */

import { db } from '../src/db/index.js'
import { users } from '../src/db/schema.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { generateToken, verifyToken } from '../src/utils/jwt.js'

async function runTests() {
  console.log('🧪 用户认证流程测试\n')
  console.log('='.repeat(60))
  
  let testsPassed = 0
  let testsFailed = 0
  
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = 'TestPassword123'
  let testUserId = null
  let testToken = null
  
  try {
    // 测试 1: 密码加密
    console.log('\n📝 测试 1: 密码加密')
    const hashedPassword = await bcrypt.hash(testPassword, 10)
    const isMatch = await bcrypt.compare(testPassword, hashedPassword)
    
    if (isMatch) {
      console.log('  ✅ 密码加密和验证正常')
      testsPassed++
    } else {
      console.log('  ❌ 密码验证失败')
      testsFailed++
    }
    
    // 测试 2: 创建用户
    console.log('\n📝 测试 2: 创建用户')
    try {
      const [newUser] = await db.insert(users).values({
        email: testEmail,
        password: hashedPassword,
        nickname: 'Test User',
        grade: 'AS'
      }).returning()
      
      testUserId = newUser.id
      console.log('  ✅ 用户创建成功')
      console.log(`     用户 ID: ${testUserId}`)
      console.log(`     邮箱: ${testEmail}`)
      testsPassed++
    } catch (err) {
      console.log('  ❌ 用户创建失败:', err.message)
      testsFailed++
    }
    
    // 测试 3: 生成 JWT Token
    console.log('\n📝 测试 3: 生成 JWT Token')
    try {
      testToken = generateToken({ userId: testUserId, email: testEmail })
      
      if (testToken && typeof testToken === 'string') {
        console.log('  ✅ Token 生成成功')
        console.log(`     Token 长度: ${testToken.length}`)
        testsPassed++
      } else {
        console.log('  ❌ Token 生成失败')
        testsFailed++
      }
    } catch (err) {
      console.log('  ❌ Token 生成失败:', err.message)
      testsFailed++
    }
    
    // 测试 4: 验证 JWT Token
    console.log('\n📝 测试 4: 验证 JWT Token')
    try {
      const payload = verifyToken(testToken)
      
      if (payload && payload.userId === testUserId && payload.email === testEmail) {
        console.log('  ✅ Token 验证成功')
        console.log(`     用户 ID: ${payload.userId}`)
        console.log(`     邮箱: ${payload.email}`)
        testsPassed++
      } else {
        console.log('  ❌ Token 验证失败：payload 不匹配')
        testsFailed++
      }
    } catch (err) {
      console.log('  ❌ Token 验证失败:', err.message)
      testsFailed++
    }
    
    // 测试 5: 验证无效 Token
    console.log('\n📝 测试 5: 验证无效 Token')
    const invalidToken = 'invalid.token.here'
    const invalidPayload = verifyToken(invalidToken)
    
    if (!invalidPayload) {
      console.log('  ✅ 无效 Token 正确被拒绝')
      testsPassed++
    } else {
      console.log('  ❌ 无效 Token 未被拒绝')
      testsFailed++
    }
    
    // 测试 6: 查询用户
    console.log('\n📝 测试 6: 查询用户')
    const [foundUser] = await db.select()
      .from(users)
      .where(eq(users.email, testEmail))
      .limit(1)
    
    if (foundUser && foundUser.id === testUserId) {
      console.log('  ✅ 用户查询成功')
      console.log(`     昵称: ${foundUser.nickname}`)
      console.log(`     年级: ${foundUser.grade}`)
      testsPassed++
    } else {
      console.log('  ❌ 用户查询失败')
      testsFailed++
    }
    
    // 测试 7: 密码验证（模拟登录）
    console.log('\n📝 测试 7: 密码验证（模拟登录）')
    const isPasswordCorrect = await bcrypt.compare(testPassword, foundUser.password)
    
    if (isPasswordCorrect) {
      console.log('  ✅ 登录密码验证成功')
      testsPassed++
    } else {
      console.log('  ❌ 登录密码验证失败')
      testsFailed++
    }
    
    // 清理：删除测试用户
    console.log('\n🧹 清理测试数据...')
    await db.delete(users).where(eq(users.id, testUserId))
    console.log('  ✅ 测试用户已删除')
    
  } catch (error) {
    console.error('\n❌ 测试执行失败:', error.message)
    console.error(error.stack)
    testsFailed++
  }
  
  // 总结
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 测试结果总结:\n')
  console.log(`  ✅ 通过: ${testsPassed}`)
  console.log(`  ❌ 失败: ${testsFailed}`)
  console.log(`  📈 通过率: ${Math.round(testsPassed / (testsPassed + testsFailed) * 100)}%`)
  
  if (testsFailed === 0) {
    console.log('\n✅ 所有测试通过！用户认证流程正常。')
    process.exit(0)
  } else {
    console.log('\n❌ 部分测试失败，请检查上述错误。')
    process.exit(1)
  }
}

runTests()
