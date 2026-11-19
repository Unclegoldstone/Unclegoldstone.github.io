# 作品内容维护

正式首页和 works.html 共用 src/works/*/index.md。复制 template 文件夹、重命名目录并填写 index.md，图片也放在对应目录。template 不加载；draft: true 不展示；featured: true 在主页和作品页均展示，false 仅在作品页展示。order 越小越靠前，与文件夹编号无关。图片使用相对于 index.md 的路径。

头部的 title、category、summary、tags、cover、images、github、date 控制卡片和详情；正文使用 Markdown。日期可留空，不推测发布日期。支持编辑器 img/zoom 图片写法。图片与正文自动随 Vite 构建打包，新增或修改后保存即可在开发环境更新，无需运行 Demo 的生成脚本。发布时重新构建网站。

合法分类：个人项目、合作项目、小工具。单个作品错误会被隔离，本地作品页显示原因。作品页具备分类筛选、搜索、发布日期排序及详情轮播。

网站入口：主页“查看全部作品”、侧栏“作品陈列室”、Blog 导航“我的作品”。作品页可返回首页或 Blogs。首页、Blog 与 Works 均使用地图转场；Works 地点为左侧铁匠铺。三条路线与地点位置见 src/transitions/routes.js，每条路线支持双向行走，虚线与人物轨迹共用同一条路径。
