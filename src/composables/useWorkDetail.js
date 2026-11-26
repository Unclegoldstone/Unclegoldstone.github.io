import { ref, nextTick, onBeforeUnmount } from 'vue'

// Show the existing card information immediately; fetch only this work's detail.
export function useWorkDetail(loadWorkDetails) {
  const selected = ref(null)
  const dialog = ref(null)
  const detailLoading = ref(false)
  const detailError = ref('')
  let requestId = 0
  let disposed = false
  let opening = false
  let sessionActive = false
  let previousOverflow = ''
  let returnFocus = null

  function restoreSession({ focus = true } = {}) {
    if (!sessionActive) return
    document.body.style.overflow = previousOverflow
    sessionActive = false
    if (focus && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true })
    returnFocus = null
  }

  function clearSelection({ focus = true } = {}) {
    requestId++
    opening = false
    selected.value = null
    detailLoading.value = false
    detailError.value = ''
    restoreSession({ focus })
  }

  async function fetchDetail(project, request) {
    detailLoading.value = true
    detailError.value = ''
    try {
      const detail = await loadWorkDetails(project.id)
      if (disposed || request !== requestId || selected.value?.id !== project.id) return
      if (!detail || typeof detail !== 'object' || Array.isArray(detail)) {
        throw new Error('作品详情未能加载，请重试。')
      }
      selected.value = { ...project, ...detail, id: project.id }
    } catch (error) {
      if (disposed || request !== requestId || selected.value?.id !== project.id) return
      detailError.value = error instanceof Error ? error.message : '作品详情加载失败，请重试。'
    } finally {
      if (!disposed && request === requestId) detailLoading.value = false
    }
  }

  async function openDetail(project) {
    if (disposed || !project?.id) return
    const request = ++requestId
    if (!sessionActive) {
      returnFocus = document.activeElement
      previousOverflow = document.body.style.overflow
      sessionActive = true
      document.body.style.overflow = 'hidden'
    }
    opening = true
    selected.value = { ...project }
    detailLoading.value = true
    detailError.value = ''
    await nextTick()
    if (disposed || request !== requestId) return
    try {
      if (!dialog.value) throw new Error('作品详情窗口尚未就绪。')
      if (!dialog.value.open) dialog.value.showModal()
      opening = false
    } catch (error) {
      clearSelection()
      throw error
    }
    await fetchDetail(project, request)
  }

  function closeDetail() {
    opening = false
    if (dialog.value?.open) dialog.value.close()
    clearSelection()
  }

  function onDialogClose() {
    // A native close event can arrive after another work has already opened.
    if (opening || dialog.value?.open) return
    clearSelection()
  }

  async function retryDetail() {
    if (disposed || !selected.value) return
    const project = selected.value
    await fetchDetail(project, ++requestId)
  }

  onBeforeUnmount(() => {
    disposed = true
    if (dialog.value?.open) dialog.value.close()
    clearSelection({ focus: false })
  })

  return { selected, dialog, detailLoading, detailError, openDetail, closeDetail, onDialogClose, retryDetail }
}
