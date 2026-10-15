import gardenOverview from '../assets/projects/garden-overview.svg'
import gardenWarm from '../assets/projects/garden-warm.svg'
import gardenNight from '../assets/projects/garden-night.svg'
import srunkeeperDetail from '../assets/projects/srunkeeper-detail.png'
import srunkeeperCover from '../assets/projects/srunkeeper-cover.png'

// publishedAt: 作品发布日期，由你填写，格式 YYYY-MM-DD；留空时显示待补充。
export const projects = [
  {
    title: '一座会生长的数字花园',
    type: '个人项目',
    scene: 'garden',
    no: '01',
    publishedAt: '',
    desc: '把零散的灵感种下，让想法慢慢生长。',
    tags: ['数字花园', '界面设计'],
    detailImages: [gardenOverview, gardenWarm, gardenNight],
    body: '这是一个作品展示示例。你可以把它替换为自己的项目介绍，说明项目的背景、设计过程，以及最终收获。\n\n这个概念将笔记想象成植物：每一次记录都是播种，每一次整理都是照料。以温暖的配色和简单的结构，让记录成为轻松的日常。'
  },
  {
    title: 'SrunKeeper',
    type: '小工具',
    scene: 'desk',
    no: '04',
    publishedAt: '2026-10-14',
    desc: 'Srun-深澜校园网认证自动化拨号脚本， 支持集中管理账号、设备, 批量化运行， 检测设备与账户的状态。',
    tags: ['校园网', '自动化工具', 'Srun'],
    cover: srunkeeperCover,
    detailImages: [srunkeeperDetail],
    isExample: false,
    body: 'SrunKeeper 是一款面向深澜（Srun）校园网的认证自动化工具，支持集中管理多个账号与设备、批量拨号、定时检测连接状态，并在断线后自动重连，让校园网连接更省心。',
    downloadUrl: 'https://github.com/Unclegoldstone/SrunKeeper'
  }
]