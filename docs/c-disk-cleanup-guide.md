# C 盘整理最佳实践指南

## 目录
1. [安全原则](#安全原则)
2. [空间分析](#空间分析)
3. [可安全清理的内容](#可安全清理的内容)
4. [可迁移到 D 盘的内容](#可迁移到-d-盘的内容)
5. [不能动的内容](#不能动的内容)
6. [具体操作步骤](#具体操作步骤)

---

## 安全原则

**⚠️ 在开始之前，请务必：**
- 备份重要数据
- 创建系统还原点（控制面板 > 系统 > 系统保护）
- 不要删除任何不确定的文件
- 不要移动 `C:\Windows` 和 `C:\Program Files` 下的内容

---

## 空间分析

### 推荐工具
1. **WinDirStat**（免费）- 可视化磁盘空间占用
2. **TreeSize Free**（免费）- 快速扫描大文件夹
3. **Windows 存储感知** - 系统自带（设置 > 系统 > 存储）

### 手动检查命令
```powershell
# 查看 C 盘各文件夹大小（PowerShell）
Get-ChildItem C:\ -Directory | ForEach-Object {
    $size = (Get-ChildItem $_.FullName -Recurse -ErrorAction SilentlyContinue |
             Measure-Object -Property Length -Sum).Sum / 1GB
    [PSCustomObject]@{
        Folder = $_.Name
        SizeGB = [math]::Round($size, 2)
    }
} | Sort-Object SizeGB -Descending | Format-Table -AutoSize
```

---

## 可安全清理的内容

### 1. 临时文件（通常可节省 5-20 GB）

#### Windows 临时文件
```
C:\Windows\Temp\
C:\Users\{用户名}\AppData\Local\Temp\
```
**操作**：
- 按 `Win + R`，输入 `%temp%`，全选删除
- 按 `Win + R`，输入 `temp`，全选删除
- 使用"磁盘清理"工具（右键 C 盘 > 属性 > 磁盘清理）

#### 浏览器缓存
```
C:\Users\{用户名}\AppData\Local\Google\Chrome\User Data\Default\Cache\
C:\Users\{用户名}\AppData\Local\Microsoft\Edge\User Data\Default\Cache\
```
**操作**：在浏览器设置中清除缓存

### 2. 系统文件（谨慎操作）

#### Windows 更新缓存（可节省 5-15 GB）
```powershell
# 清理 Windows 更新文件（需管理员权限）
Dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase
```

#### 休眠文件（可节省 = 内存大小）
```powershell
# 如果不使用休眠功能，可以禁用（需管理员权限）
powercfg -h off
```
**注意**：这会删除 `C:\hiberfil.sys`，禁用快速启动和休眠功能

#### 页面文件（不建议删除）
```
C:\pagefile.sys
```
**建议**：保留或移动到 D 盘（高级系统设置 > 性能 > 高级 > 虚拟内存）

### 3. 回收站
```
C:\$Recycle.Bin\
```
**操作**：右键回收站 > 清空回收站

### 4. Windows.old（如果存在）
```
C:\Windows.old\
```
**说明**：系统升级后的旧版��备份，通常 10-20 GB
**操作**：磁盘清理 > 清理系统文件 > 勾选"以前的 Windows 安装"

---

## 可迁移到 D 盘的内容

### 1. 用户文件夹（推荐迁移）

#### 文档、下载、图片、视频、音乐
```
C:\Users\{用户名}\Documents\
C:\Users\{用户名}\Downloads\
C:\Users\{用户名}\Pictures\
C:\Users\{用户名}\Videos\
C:\Users\{用户名}\Music\
```

**迁移步骤**：
1. 在 D 盘创建对应文件夹（如 `D:\Documents`）
2. 右键 C 盘对应文件夹 > 属性 > 位置
3. 点击"移动"，选择 D 盘新文件夹
4. 点击"应用"，系统会自动移动文件

**优点**：
- 系统重装后数据不丢失
- 释放 C 盘空间
- 程序仍能正常访问（路径自动更新）

#### 桌面
```
C:\Users\{用户名}\Desktop\
```
**同上操作**，迁移到 `D:\Desktop`

### 2. 开发环境缓存（如果你是开发者）

#### Node.js 全局包和缓存
```
C:\Users\{用户名}\AppData\Roaming\npm\
C:\Users\{用户名}\AppData\Local\npm-cache\
```
**操作**：
```bash
# 设置 npm 缓存到 D 盘
npm config set cache "D:\npm-cache"
npm config set prefix "D:\npm-global"
```

#### Bun 缓存（你的项目使用 bun）
```
C:\Users\{用户名}\.bun\
```
**操作**：
```bash
# 设置环境变量
setx BUN_INSTALL "D:\.bun"
```

#### Python pip 缓存
```
C:\Users\{用户名}\AppData\Local\pip\
```
**操作**：
```bash
pip config set global.cache-dir "D:\pip-cache"
```

#### Git 仓库
```
C:\Users\{用户名}\Documents\GitHub\
```
**操作**：直接剪切到 `D:\CodeProjects\`（你已经在用这个路径）

### 3. 应用程序（部分支持）

#### Steam 游戏库
**操作**：Steam > 设置 > 下载 > Steam 库文件夹 > 添加 D 盘路径

#### OneDrive / Google Drive 同步文件夹
**操作**：在应用设置中更改同步文件夹位置到 D 盘

#### 虚拟机文件（VirtualBox / VMware）
**操作**：在虚拟机设置中更改虚拟磁盘位置到 D 盘

---

## 不能动的内容

### ❌ 绝对不要移动或删除

1. **系统文件夹**
   ```
   C:\Windows\
   C:\Program Files\
   C:\Program Files (x86)\
   C:\ProgramData\
   ```

2. **系统关键文件**
   ```
   C:\bootmgr
   C:\Boot\
   C:\System Volume Information\
   ```

3. **用户配置文件核心**
   ```
   C:\Users\{用户名}\AppData\（除了 Temp 和缓存）
   C:\Users\{用户名}\NTUSER.DAT
   ```

---

## 具体操作步骤

### 阶段 1：安全清理（预计节省 10-30 GB）

1. **创建系统还原点**
   - 控制面板 > 系统 > 系统保护 > 创建

2. **运行磁盘清理**
   - 右键 C 盘 > 属性 > 磁盘清理
   - 点击"清理系统文件"
   - 勾选所有可清理项（特别是"以前的 Windows 安装"）

3. **清理临时文件**
   - `Win + R` > `%temp%` > 全选删除
   - `Win + R` > `temp` > 全选删除

4. **清理浏览器缓存**
   - Chrome: 设置 > 隐私和安全 > 清除浏览数据
   - Edge: 设置 > 隐私、搜索和服务 > 清除浏览数据

5. **清空回收站**

### 阶段 2：迁移用户文件夹（预计节省 20-100 GB）

1. **在 D 盘创建文件夹结构**
   ```
   D:\Documents\
   D:\Downloads\
   D:\Desktop\
   D:\Pictures\
   D:\Videos\
   D:\Music\
   ```

2. **逐个迁移**（按上述"迁移步骤"操作）
   - 文档
   - 下载
   - 桌面
   - 图片
   - 视频
   - 音乐

3. **验证**：打开"此电脑"，确认文件夹图标显示正确路径

### 阶段 3：开发环境优化（如适用）

1. **迁移项目代码**
   - 将 `C:\Users\{用户名}\Documents\` 下的项目移到 `D:\CodeProjects\`

2. **配置包管理器缓存**
   ```bash
   # npm
   npm config set cache "D:\npm-cache"

   # bun
   setx BUN_INSTALL "D:\.bun"
   ```

3. **清理 node_modules**
   ```bash
   # 查找所有 node_modules（PowerShell）
   Get-ChildItem -Path C:\ -Directory -Recurse -Filter "node_modules" -ErrorAction SilentlyContinue

   # 删除不用的项目的 node_modules
   ```

### 阶段 4：高级优化（可选）

1. **移动页面文件到 D 盘**
   - 控制面板 > 系统 > 高级系统设置 > 性能设置 > 高级 > 虚拟内存
   - 取消 C 盘，设置 D 盘（系统管理的大小）

2. **禁用休眠**（如果不用）
   ```powershell
   powercfg -h off
   ```

3. **启用存储感知**
   - 设置 > 系统 > 存储 > 存储感知
   - 配置自动清理临���文件

---

## 预期效果

| 操作 | 预计节省空间 | 风险等级 |
|------|-------------|---------|
| 清理临时文件 | 5-20 GB | 低 |
| 清理 Windows.old | 10-20 GB | 低 |
| 迁移用户文件夹 | 20-100 GB | 低 |
| 禁用休眠文件 | = 内存大小 | 中 |
| 移动页面文件 | 2-16 GB | 中 |
| 清理开发缓存 | 5-50 GB | 低 |

---

## 维护建议

### 每月一次
- 运行磁盘清理
- 清理浏览器缓存
- 清空回收站

### 每季度一次
- 检查大文件夹（用 WinDirStat）
- 清理不用的程序（设置 > 应用）
- 清理开发环境缓存

### 养成习惯
- 下载文件后及时整理
- 不在桌面堆积文件
- 定期备份重要数据到 D 盘或云端

---

## 常见问题

**Q: 迁移后程序找不到文件怎么办？**
A: 使用 Windows 的"位置"功能迁移，系统会自动更新注册表路径。如果手动剪切粘贴，可能导致程序找不到文件。

**Q: C 盘至少要留多少空间？**
A: 建议至少保留 20-30 GB 空闲空间，确保系统更新和临时文件有足够空间。

**Q: 可以把 Program Files 移到 D 盘吗？**
A: 不建议。虽然技术上可行，但可能导致程序无法启动、更新失败等问题。新安装程序时可以选择安装到 D 盘。

**Q: 迁移失败怎么办？**
A: 使用系统还原点恢复到迁移前的状态。

---

## 总结

**推荐操作顺序**：
1. ✅ 创建系统还原点
2. ✅ 磁盘清理（安全，立即见效）
3. ✅ 迁移用户文件夹（安全，效果显著）
4. ⚠️ 高级优化（需要一定技术知识）

**不推荐操作**：
- ❌ 使用第三方"一键清理"工具（可能误删重要文件）
- ❌ 手动删除 Windows 文件夹下的内容
- ❌ 移动 Program Files

遵循本指南，你应该能安全地释放 30-100 GB 的 C 盘空间。
