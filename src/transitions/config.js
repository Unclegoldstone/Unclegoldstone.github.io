// 两个页面共用。style 可选 'map'、'fade'、'none'。
export const pageTransition = {
  style: 'map',
  durationMs: 2300,
  openingMs: 160,
  arrivalMs: 140,
  walkFps: 12,
  // 显示的虚线与人物行走共用这一条路径，坐标基于 1672×941 的地图。
  path: 'M 1078 516 C 1020 561, 933 566, 861 521 S 716 453, 738 368',
}
