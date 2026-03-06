# 认知模型

> 待完善：使用 `/meta-42cog` 生成完整的认知敏捷法文档

## 核心实体

### Subject（科目）
- 属性：id, name, units
- 关系：包含多个 Unit

### Unit（单元）
- 属性：id, name, chapters
- 关系：属于一个 Subject，包含多个 Chapter

### Chapter（章节）
- 属性：id, name, topics, videos
- 关系：属于一个 Unit，包含多个 Topic 和 Video

### Topic（主题）
- 属性：id, name, content
- 关系：属于一个 Chapter

### Video（视频）
- 属性：id, title, url, platform
- 关系：关联到 Chapter

## 业务流程

1. 用户选择科目
2. 浏览单元和章节
3. 查看主题内容
4. 观看相关视频
5. 完成练习题
