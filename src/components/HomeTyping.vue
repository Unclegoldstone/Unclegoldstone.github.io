<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import homeText from '../../docs/HOME.md?raw'

const lines = homeText
  .replace(/<!--[\s\S]*?-->/g, '')
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(line => line && !line.startsWith('#'))

const selectedLine = ref('')
const typedText = ref('')
let timer

function pickLine() {
  const alternatives = lines.filter(line => line !== selectedLine.value)
  const pool = alternatives.length ? alternatives : lines.length ? lines : ['HELLO, WORLD']
  selectedLine.value = pool[Math.floor(Math.random() * pool.length)]
}

function startLine() {
  pickLine()
  const characters = Array.from(selectedLine.value)
  let index = 0
  function typeNext() {
    typedText.value += characters[index++]
    if (index < characters.length) timer = window.setTimeout(typeNext, 70)
    else timer = window.setTimeout(eraseNext, 4000)
  }
  function eraseNext() {
    const remaining = Array.from(typedText.value)
    remaining.pop()
    typedText.value = remaining.join('')
    timer = window.setTimeout(remaining.length ? eraseNext : startLine, remaining.length ? 35 : 300)
  }
  timer = window.setTimeout(typeNext, 200)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pickLine()
    typedText.value = selectedLine.value
    return
  }
  startLine()
})

onBeforeUnmount(() => window.clearTimeout(timer))
</script>

<template>
  <span class="eyebrow home-typing" :aria-label="selectedLine">
    <span class="status-dot" aria-hidden="true"></span>
    <span class="home-typing-text" aria-hidden="true">{{ typedText }}<span class="typing-cursor">_</span></span>
  </span>
</template>

<style scoped>
.home-typing{min-height:1.6em;line-height:1.6;align-items:baseline}
.home-typing>.status-dot{flex-shrink:0;align-self:center}
.home-typing-text{min-width:0;overflow-wrap:anywhere}
.typing-cursor{display:inline-block;animation:typing-blink 1s steps(1,end) infinite}
@keyframes typing-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@media(prefers-reduced-motion:reduce){.typing-cursor{animation:none}}
</style>
