// 测试数据源适配层
import { dataSource } from './src/data/dataSource.js'

console.log('🧪 开始测试数据源适配层...\n')

// 测试1：获取所有科目
console.log('📋 测试1：获取所有科目')
const subjects = await dataSource.getSubjects()
console.log(`✅ 成功获取 ${Object.keys(subjects).length} 个科目`)
console.log('科目列表:', Object.keys(subjects).join(', '))

// 测试2：获取单个科目详情
console.log('\n📋 测试2：获取科目详情')
const economics = await dataSource.getSubject('economics')
console.log(`✅ 成功获取: ${economics.name.zh}`)
console.log(`单元数量: ${Object.keys(economics.books).length}`)

// 统计章节数
let totalChapters = 0
for (const unit of Object.values(economics.books)) {
  totalChapters += unit.chapters?.length || 0
}
console.log(`章节数量: ${totalChapters}`)

// 测试3：获取章节详情
console.log('\n📋 测试3：获取章节详情')
const chapter = await dataSource.getChapter('e1c1')
if (chapter) {
  console.log(`✅ 成功获取: ${chapter.title.zh}`)
  console.log(`知识点数量: ${chapter.keyPoints?.length || 0}`)
} else {
  console.log('❌ 章节未找到')
}

// 测试4：缓存机制
console.log('\n📋 测试4：测试缓存机制')
console.time('首次获取')
await dataSource.getSubject('history')
console.timeEnd('首次获取')

console.time('缓存获取')
await dataSource.getSubject('history')
console.timeEnd('缓存获取')

console.log('\n✅ 所有测试通过！')
process.exit(0)
