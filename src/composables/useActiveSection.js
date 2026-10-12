import { onMounted, onUnmounted } from 'vue'

// Follow the reading position in the visible content, including the short last section.
export function useActiveSection(active, sectionIds) {
  let frame = 0
  let observer

  function update() {
    frame = 0
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return

    const headerBottom = document.querySelector('.topbar')?.getBoundingClientRect().bottom ?? 0
    const marker = headerBottom + Math.max(24, (window.innerHeight - headerBottom) * 0.5)
    let current = sections[0].id
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= marker) current = section.id
    }

    const page = document.scrollingElement
    if (page && page.scrollTop > 0 && page.scrollTop + page.clientHeight >= page.scrollHeight - 2) {
      current = sections.at(-1).id
    }
    active.value = current
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(update)
  }

  onMounted(() => {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('pageshow', schedule)
    observer = new ResizeObserver(schedule)
    for (const selector of ['#main-content', '.topbar']) {
      const element = document.querySelector(selector)
      if (element) observer.observe(element)
    }
    schedule()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    window.removeEventListener('pageshow', schedule)
    observer?.disconnect()
    if (frame) window.cancelAnimationFrame(frame)
  })
}
