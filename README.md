# Goldstone 像素小站

Vue 3 + Vite 构建的静态个人网站，无后端、无数据库。插画、头像与动画资源均保存在项目内，无需外部图片或字体服务。

## 运行

在项目目录打开终端：

```sh
npm install
npm run dev
```

访问终端显示的本地地址。

## 构建

```sh
npm run build
npm run preview
```

`dist/` 为可部署到静态网站服务的成品。请使用 HTTP 服务浏览，直接双击 HTML 不支持模块加载。

## 布局与功能

- 1100px 及以上默认展开 A（导航）、C（个人信息），可独立收起；B 为主内容。
- 1100px 以下两侧默认收起，展开为遮罩抽屉，一次只展开一个。
- 进入不同宽度区间时恢复该区间默认状态；同一区间内保留当前开关状态。
- 手机布局、作品筛选、作品与随笔详情、深浅主题、页面导航、回到顶部。
- Escape 或点击遮罩可关闭抽屉；详情弹窗支持 Escape 关闭和键盘焦点约束。

## 替换内容

- `src/App.vue`：整体布局、个人介绍、导航与资料。
- `src/data/projects.js`：作品数据。
- `src/data/notes.js`：随笔数据。
- `src/components/`：作品和随笔展示组件。
- `docs/CONTENT.md`：新增及修改内容的说明。
- `src/style.css`：颜色、布局、像素风组件及适配规则。
- `src/PixelScene.vue`：自带像素插画。
- `public/favicon.svg`：网站图标。
- `index.html`：网站标题与搜索描述。

这是本地静态版本，未发布到互联网。
