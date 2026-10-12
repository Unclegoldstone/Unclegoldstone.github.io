<script setup>
import { ref } from 'vue'

const email = '252050193@hdu.edu.cn'
const emailDialog = ref(null)
const emailInput = ref(null)
const copyStatus = ref('')

function openEmail() {
  copyStatus.value = ''
  emailDialog.value.showModal()
}

async function copyEmail() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(email)
    } else {
      emailInput.value.focus()
      emailInput.value.select()
      if (!document.execCommand('copy')) throw new Error('Copy failed')
    }
    copyStatus.value = '已复制邮箱'
  } catch {
    emailInput.value.focus()
    emailInput.value.select()
    copyStatus.value = '复制未成功，请长按或手动复制邮箱'
  }
}
</script>

<template>
  <div class="sidebar-actions" role="group" aria-label="快捷功能">
    <a class="sidebar-action" href="https://github.com/Unclegoldstone" target="_blank" rel="noopener noreferrer" aria-label="在新标签页打开我的 GitHub" title="我的 GitHub">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 .75a11.25 11.25 0 0 0-3.558 21.924c.563.104.77-.244.77-.542 0-.267-.01-.974-.015-1.912-3.13.68-3.79-1.508-3.79-1.508-.512-1.3-1.25-1.647-1.25-1.647-1.023-.7.078-.686.078-.686 1.132.08 1.728 1.162 1.728 1.162 1.006 1.724 2.64 1.226 3.283.937.102-.728.394-1.226.716-1.508-2.499-.284-5.126-1.25-5.126-5.564 0-1.23.44-2.234 1.16-3.022-.116-.284-.503-1.43.11-2.98 0 0 .945-.303 3.094 1.154A10.78 10.78 0 0 1 12 6.18c.956.004 1.918.129 2.817.379 2.148-1.457 3.092-1.154 3.092-1.154.614 1.55.227 2.696.112 2.98.722.788 1.158 1.792 1.158 3.022 0 4.325-2.631 5.277-5.138 5.556.404.35.765 1.043.765 2.1 0 1.517-.014 2.741-.014 3.113 0 .301.203.652.774.541A11.252 11.252 0 0 0 12 .75Z"/></svg>
    </a>
    <button class="sidebar-action" type="button" aria-label="查看我的邮箱" title="我的邮箱" @click="openEmail">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h18v14H3zM3 6l9 7 9-7"/></svg>
    </button>
    <button class="sidebar-action reserved-action" type="button" disabled aria-label="预留功能 3，暂未启用" title="功能待添加">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
    </button>
  </div>
  <dialog ref="emailDialog" class="email-dialog" aria-labelledby="email-dialog-title" @click="event => { if (event.target === emailDialog) emailDialog.close() }" @keydown.esc.stop>
    <div class="email-dialog-header">
      <h2 id="email-dialog-title">我的邮箱</h2>
      <button class="small-button" type="button" aria-label="关闭邮箱窗口" @click="emailDialog.close()">×</button>
    </div>
    <div class="email-copy-row">
      <input ref="emailInput" class="email-address" :value="email" aria-label="邮箱地址" readonly>
      <button class="email-copy-button" type="button" @click="copyEmail">Copy</button>
    </div>
    <p class="email-copy-status" role="status">{{ copyStatus }}</p>
  </dialog>
</template>
