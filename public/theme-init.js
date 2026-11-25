// Runs before the page is painted, so navigation does not flash the default theme.
(() => {
  let light = false
  try { light = localStorage.getItem('goldstone-theme') === 'light' } catch { /* Use default. */ }
  document.documentElement.dataset.theme = light ? 'light' : 'dark'
  document.documentElement.style.colorScheme = light ? 'light' : 'dark'
  document.documentElement.style.backgroundColor = light ? '#f1efe5' : '#11191b'
})()
