import { ref, watch, onMounted, onScopeDispose } from 'vue'

const key = 'goldstone-theme'
function readTheme() {
  try { return localStorage.getItem(key) === 'light' }
  catch { return document.documentElement.dataset.theme === 'light' }
}
function apply(light) {
  const theme = light ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  document.documentElement.style.backgroundColor = light ? '#f1efe5' : '#11191b'
  document.body.classList.toggle('light', light)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f1efe5' : '#11191b')
}

export function useTheme() {
  const light = ref(readTheme())
  apply(light.value)
  const stop = watch(light, value => {
    apply(value)
    try { localStorage.setItem(key, value ? 'light' : 'dark') } catch { /* Storage may be disabled. */ }
  }, { flush: 'sync' })
  function sync() { light.value = readTheme(); apply(light.value) }
  function storage(event) { if (event.key === key || event.key === null) sync() }
  onMounted(() => {
    window.addEventListener('pageshow', sync)
    window.addEventListener('storage', storage)
  })
  onScopeDispose(() => {
    stop()
    window.removeEventListener('pageshow', sync)
    window.removeEventListener('storage', storage)
  })
  return { light, toggleTheme: () => { light.value = !light.value } }
}
