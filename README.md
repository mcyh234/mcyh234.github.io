# mcyh234 的个人主页

一个可以直接部署到 GitHub Pages 的中文个人实验室。HTML、CSS、JavaScript 与本地 Three.js，无部署构建步骤、后端、API Key 或运行时第三方请求。

第二版以「把麻烦变成工具，把好奇变成作品」为核心，保留原 GitHub 像素头像和真实项目，增加四条创作主张与可交互的三维像素装置。

## 本地预览

直接打开 `index.html`。三维装置、项目筛选、主题切换和导航均可离线使用。

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
| `style.css` | 基础组件、项目卡片与字体 |
| `lab.css` | 第二版视觉、首屏、理念区与响应式动效样式 |
| `theme.js` | 在首次绘制前读取主题，避免闪烁 |
| `app.js` | 筛选、搜索、主题切换、移动导航、复制用户名、阅读进度 |
| `motion.js` | 入场、滚动渐入、筛选 FLIP 动画、全局动效偏好 |
| `scene.js` | Three.js 像素装置、组装/连接/拆解、鼠标视差与拖动 |
| `assets/` | 本地图片、字体、Lucide 图标及许可 |
| `assets/vendor/` | 本地 Three.js 压缩包和 MIT 许可 |
| `.nojekyll` | 保持纯静态资源发布 |
| `.github/workflows/pages.yml` | 可选的 GitHub Actions 发布工作流 |

项目内容直接写在 HTML 中，关闭 JavaScript 仍可查看全部项目和跳转链接。修改项目时同步更新 `data-category`、`data-search`、筛选数量与页面底部的快照日期；结果数量由 JavaScript 自动计算。

可用分类：`app`（应用工具）、`automation`（自动化）、`experiment`（趣味实验）。

## 数据与隐私

- 项目资料和 GitHub star 数量核对于 **2026-09-19**；它们是明确标注日期的静态快照，不会自动刷新。
- `upstream-ops` 标注为 fork，保留 `bejix/upstream-ops` 上游入口。
- `SavedStream` 保留基于 TeleBox 的说明。
- 未编造邮箱、职业履历、所在地或社交账号。
- 页面无追踪、无分析 SDK、无表单提交。只在本地存储主题与动效偏好。
- 外部项目链接在新窗口打开，并使用 `noopener noreferrer`。
- 图片、字体和图标均随站点提供；查看页面不依赖 CDN。
- 理念文案只保留经概括的创作偏好，不包含会话原文、私人身份、账号、服务器资料或未公开项目文件。

## 动效与降级

- 首屏像素装置可组装、连接、拆解及重新组装，桌面支持拖动与指针视差。
- 首屏分层入场；内容滚动渐入；项目筛选使用真实布局的 FLIP 过渡；理念支持原生 `details` 展开。
- 顶栏暂停按钮同时停止 WebGL、CSS 和 Web Animations，并记住选择。
- 系统开启 `prefers-reduced-motion` 时默认静止，模式切换立即呈现结果，不强迫播放动画。
- WebGL 在离开首屏或标签页隐藏时停止，返回后恢复；手机最多约 30 fps，并限制渲染像素比。
- WebGL 不可用或上下文丢失时回退到本地头像，不影响项目、联系入口和导航。
- 禁用 JavaScript 时仍可阅读正文、展开理念、使用项目链接和移动导航。

Three.js 0.186.0 已本地化，不需要安装运行时依赖。`scene.js` 为可直接编辑的普通脚本。`assets/vendor/three.min.js` 是使用 esbuild 0.28.2 生成的 IIFE 包，提供 `window.THREE`；修改场景无需重新打包该库。

## 素材

详情见 `assets/CREDITS.md`。GitHub 头像与游戏截图属于各自权利人；本站代码不对第三方素材额外授予许可。

## 验证记录

2026-09-22 使用 Playwright 与 Microsoft Edge 完成 140 项浏览器检查：

- 11 种桌面与移动端尺寸（320–2560 px）检查横向溢出、文字边界、控件位置、首屏延续和三维非空画面。
- 分类、搜索、空状态、主题记忆、系统主题跟随、复制成功与权限拒绝反馈均通过。
- 本地 `file://`、离线、GitHub Pages 子目录、禁用 JavaScript 和禁用存储场景通过。
- 三维画布像素变化、组装/拆解/重放、拖动、全局暂停、暂停记忆、离屏停渲染、减少动态效果及键盘导航通过。
- 无 WebGL 回退、原生理念展开和原有项目交互回归通过。
- 桌面 / 手机 × 浅色 / 深色四组 axe WCAG A/AA 自动检查无违规；自动检查不等同于完整人工无障碍认证。

仓库启用 GitHub Actions 部署后，推送到 `main` 会自动更新线上主页。
