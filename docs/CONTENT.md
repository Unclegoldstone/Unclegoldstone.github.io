# 内容维护

网站通过本地 Markdown 和图片文件维护内容，无需数据库或后台。日常新增文章、作品不需要修改页面组件或手动维护 JavaScript 数组。

## Blog 文章

- 文章存放在 `src/blogs/posts/`，每篇文章一个 `.md` 文件。
- 新文章可复制 `article.tmplate`，将副本改名为 `.md` 后填写内容；原始模板不会加入文章列表。
- Blog 图片统一放在 `src/blogs/posts/assets/`，正文使用 `./assets/图片.png` 等相对路径。
- 文章通过文件头部设置标题、发布日期、分类、摘要等信息，正文使用 Markdown。支持多分类、图片、表格、代码块和自动目录，也兼容编辑器生成的 `<img>` / `zoom` 图片缩放写法。
- 首页“最近的碎碎念”只展示按发布日期排序的最新三篇已发布文章摘要。摘要优先取 `excerpt`，未填写时由正文首段生成。
- 阅读地址为 `blog.html#文章slug`，可直接分享。发布后尽量保持文件名或显式 `slug` 不变。

完整写作规则见 [BLOG.md](./BLOG.md)。

## 作品

作品存放在 `src/works/`，每个作品一个文件夹，介绍文件必须名为 `index.md`。封面和详情图片与作品放在一起，例如：

```text
src/works/
├─ template/
└─ 04-my-project/
   ├─ index.md
   ├─ cover.png
   └─ screenshots/
      ├─ overview.png
      └─ detail.png
```

复制整个 `template` 文件夹并重命名即可准备新作品；`template` 本身不会加载。文件夹编号用于管理文件，页面顺序仍由 `order` 控制。

主页与作品页共用同一份 `index.md`：`summary`、封面等用于卡片，正文与详情图片用于打开后的展示。`featured: true` 同时在主页和作品页展示，`featured: false` 仅在作品页展示；`draft: true` 两处均不展示。

卡片封面与详情图片可以不同，多张详情图片使用轮播。图片路径相对于该作品的 `index.md`。新增内容无需再运行独立 Demo 的生成脚本。

完整字段说明见 [WORKS.md](./WORKS.md)。

## 页面按需加载

`build/contentPlugin.js` 在 Vite 开发服务或正式构建阶段解析 Markdown 和 YAML，并生成不同页面需要的内容模块。浏览器不再下载 Markdown 解析器，也不再在打开主页时解析全部文章和作品正文。

| 场景 | 加载内容 |
| --- | --- |
| 首页 | 最新三篇 Blog 的摘要、主页精选作品的卡片信息，以及文章/作品总数 |
| Blog 列表 | 文章列表信息、分类、摘要、阅读时长等，不包含全部正文 |
| 打开某篇文章 | 按需加载该文章已生成的正文和目录 |
| Blog 正文搜索 | 输入搜索条件后，按需加载全文搜索索引 |
| 作品页 | 全部已发布作品的卡片信息，不包含全部详细介绍和轮播图列表 |
| 打开作品详情 | 按需加载该作品的详细介绍及详情图片地址 |

图片由实际展示位置和延迟加载设置决定下载时机；打包图片地址不等于立即下载所有图片。内容仍会影响对应列表或搜索索引的大小，但正文增加不会再直接扩大首页的初始内容包。

单篇文章或作品的配置错误会被隔离，本地页面显示提示，其他内容正常加载。修正并保存后，开发服务会自动更新；新增或删除内容文件也无需手动改数组。

## 本地预览和发布

在项目根目录运行：

```powershell
# 开发预览：修改内容后自动更新
npm.cmd run dev

# 生成正式静态文件
npm.cmd run build

# 检查最近一次构建生成的 dist
npm.cmd run preview
```

浏览器地址以终端输出为准。网站有三个 HTML 入口：

- `index.html`：小站主页，入口为 `src/main.js` / `src/App.vue`。
- `blog.html`：Blog，入口为 `src/blog.js` / `src/Blog.vue`。
- `works.html`：作品页，入口为 `src/works.js` / `src/Works.vue`。

`vite.config.js` 会同时构建三个入口，并将资源和按需加载的正文模块输出到 `dist/`。修改 Markdown、图片或其他源文件后，线上网站需要重新构建和部署才会更新；仅修改本地文件不会改变已发布版本。

## 首页打字文本

编辑 `docs/HOME.md`，每行一句。标题、HTML 注释和空行不会参与抽取。组件 `src/components/HomeTyping.vue` 随机逐字打印一句，完整显示约 4 秒后逐字删除，再选择下一句；有多条不同文本时不会连续重复同一句。偏好减少动态效果的设备直接显示完整文本。

此文件是首页的运行内容来源，发布修改时也需要重新构建。

## 时段插画与其他界面设置

`src/components/DayScene.vue` 根据访问者设备的本地时间选择插画，每分钟检查一次，并在重新显示、返回或聚焦页面时更新。图片位于 `src/assets/day-scenes/`，映射位于 `src/data/dayScenes.js`。

八个固定视觉时段为：00–03 午夜、03–06 日出、06–09 早晨、09–12 中午、12–15 下午、15–18 傍晚、18–21 黄昏、21–24 夜晚，包含起始时间、不包含结束时间；不计算当地真实日出日落。

主题选择由 `src/composables/useTheme.js` 统一保存，跨页和刷新后恢复。地图转场时长、风格及路线分别位于 `src/transitions/config.js`、`src/transitions/routes.js`，具体说明见 [TRANSITIONS.md](./TRANSITIONS.md)。

页面布局通常在对应 Vue 组件中修改；首页和 Blog 的基础样式位于 `src/style.css`，作品页样式位于 `src/works.css`。只更新文章或作品内容时，不需要改这些界面文件。
