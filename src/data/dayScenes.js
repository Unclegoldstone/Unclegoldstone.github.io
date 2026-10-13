// Local device time, split into eight three-hour periods.
export const dayScenes = [
  { name: '午夜', startHour: 0, src: new URL('../assets/day-scenes/midnight.svg', import.meta.url).href },
  { name: '日出', startHour: 3, src: new URL('../assets/day-scenes/sunrise.svg', import.meta.url).href },
  { name: '早晨', startHour: 6, src: new URL('../assets/day-scenes/morning.svg', import.meta.url).href },
  { name: '中午', startHour: 9, src: new URL('../assets/day-scenes/noon.svg', import.meta.url).href },
  { name: '下午', startHour: 12, src: new URL('../assets/day-scenes/afternoon.svg', import.meta.url).href },
  { name: '傍晚', startHour: 15, src: new URL('../assets/day-scenes/evening.svg', import.meta.url).href },
  { name: '黄昏', startHour: 18, src: new URL('../assets/day-scenes/dusk.svg', import.meta.url).href },
  { name: '夜晚', startHour: 21, src: new URL('../assets/day-scenes/night.svg', import.meta.url).href },
]

export function getDayScene(hour) {
  return dayScenes[Math.floor(hour / 3)]
}
