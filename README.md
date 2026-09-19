# mcyh234 的个人主页

一个可以直接部署到 GitHub Pages 的中文个人主页。纯 HTML、CSS、JavaScript，无构建步骤、后端、API Key 或运行时第三方请求。

## 本地预览

直接打开 `index.html`。项目筛选、主题切换和导航均可离线使用。

图标已内嵌到 HTML，本地双击即可完整预览，不需要启动开发服务器。

## GitHub Pages 部署

### 方式一：直接发布分支（最简单）

1. 在 `mcyh234` 账号下创建公开仓库 `mcyh234.github.io`。
2. 将**此目录内的文件**放到仓库根目录，确保 `index.html` 位于根目录，而不是再嵌套一层文件夹。
3. 提交到 `main` 分支。
4. 打开仓库 **Settings → Pages**。
5. 在 **Build and deployment → Source** 中选择 **Deploy from a branch**。
6. 选择 **main / (root)**，保存。
7. 部署成功后访问 `https://mcyh234.github.io/`。

如果使用分支发布，请删除 `.github/workflows/pages.yml`，避免同时运行两种发布流程。

### 方式二：GitHub Actions

1. 同样将所有文件放在仓库根目录，保留 `.github/workflows/pages.yml`。
2. 在 **Settings → Pages → Source** 中选择 **GitHub Actions**。
3. 推送到 `main`，或在 **Actions → Deploy to GitHub Pages → Run workflow** 手动运行。
4. 工作流只上传站点文件，不发布 README、测试或开发依赖。

不用运行 `npm install` 或 `npm run build`。不要同时启用两种发布方式。

### 使用其他仓库名称

全部站内资源采用相对路径，可部署到 `https://mcyh234.github.io/仓库名/`。需要相应修改 `index.html` 中的 `og:image`，使其指向实际发布路径。

## 内容维护

| 文件 | 用途 |
| --- | --- |
| `index.html` | 个人介绍、项目、联系方式、社交分享元数据 |
| `style.css` | 颜色、布局、响应式样式和字体 |
| `theme.js` | 在首次绘制前读取主题，避免闪烁 |
| `app.js` | 筛选、搜索、主题切换、移动导航、复制用户名、像素背景 |
| `assets/` | 本地图片、字体、Lucide 图标及许可 |
| `.nojekyll` | 保持纯静态资源发布 |
| `.github/workflows/pages.yml` | 可选的 GitHub Actions 发布工作流 |

项目内容直接写在 HTML 中，关闭 JavaScript 仍可查看全部项目和跳转链接。修改项目时同步更新 `data-category`、`data-search`、筛选数量与页面底部的快照日期；结果数量由 JavaScript 自动计算。

可用分类：`app`（应用工具）、`automation`（自动化）、`experiment`（趣味实验）。

## 数据与隐私

- 项目资料和 GitHub star 数量核对于 **2026-09-19**；它们是明确标注日期的静态快照，不会自动刷新。
- `upstream-ops` 标注为 fork，保留 `bejix/upstream-ops` 上游入口。
- `SavedStream` 保留基于 TeleBox 的说明。
- 未编造邮箱、职业履历、所在地或社交账号。
- 页面无追踪、无分析 SDK、无表单提交。只在本地存储主题偏好。
- 外部项目链接在新窗口打开，并使用 `noopener noreferrer`。
- 图片、字体和图标均随站点提供；查看页面不依赖 CDN。
- 尊重 `prefers-reduced-motion`，背景在离开视口或页面隐藏时暂停。

## 素材

详情见 `assets/CREDITS.md`。GitHub 头像与游戏截图属于各自权利人；本站代码不对第三方素材额外授予许可。

## 验证记录

2026-09-19 使用 Playwright 与 Microsoft Edge 完成 88 项浏览器检查：

- 10 种桌面与移动端尺寸（320–2560 px）无横向溢出、卡片重叠或控件文字溢出。
- 分类、搜索、空状态、主题记忆、系统主题跟随、复制成功与权限拒绝反馈均通过。
- 本地 `file://`、离线、GitHub Pages 子目录、禁用 JavaScript 和禁用存储场景通过。
- Canvas 像素、动态交互、减少动态效果及键盘导航通过。
- 桌面 / 手机 × 浅色 / 深色四组 axe WCAG A/AA 自动检查无违规；自动检查不等同于完整人工无障碍认证。

仓库启用 GitHub Actions 部署后，推送到 `main` 会自动更新线上主页。
