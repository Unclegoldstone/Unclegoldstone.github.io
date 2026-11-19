import { pageTransition } from './config.js'

// Map coordinates use the original 1672×941 canvas.
export const worldLocations = {
  home: { name: '小站入口', arrival: [1078, 516] },
  blog: { name: 'Blogs', arrival: [738, 368] },
  works: { name: 'Works', arrival: [440, 493], icon: { x: 335, y: 295, width: 210, height: 210 } },
}

// Each path is both the visible dashed route and the traveler's motion path.
export const worldRoutes = [
  { id: 'home-blog', from: 'home', to: 'blog', path: pageTransition.path, mobileViewBox: '620 215 650 430' },
  { id: 'home-works', from: 'home', to: 'works', path: 'M 1078 516 C 1030 600, 920 625, 780 620 S 570 600, 440 493', mobileViewBox: '285 245 965 455' },
  { id: 'blog-works', from: 'blog', to: 'works', path: 'M 738 368 C 680 420, 560 420, 440 493', mobileViewBox: '290 200 650 430' },
]

export function findWorldRoute(from, to) {
  const route = worldRoutes.find(route => (route.from === from && route.to === to) || (route.to === from && route.from === to))
  return route ? { ...route, reverse: route.from !== from } : null
}
