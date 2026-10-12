<script setup>
defineProps({ notes: { type: Array, required: true } })
const emit = defineEmits(['open-detail'])
</script>

<template>
  <section id="notes" class="content-section">
    <div class="section-heading">
      <div>
        <span class="section-index">02 /</span>
        <h2>最近的碎碎念</h2>
        <span class="section-en">FIELD NOTES</span>
      </div>
      <span class="section-count">文字里的日常</span>
    </div>
    <div class="note-list">
      <button v-for="(note, i) in notes" :key="note.title" @click="emit('open-detail', note)">
        <span class="note-date">{{ note.date }}<small>{{ note.year }}</small></span>
        <div>
          <span class="note-category">{{ note.category }}</span>
          <h3>{{ note.title }}</h3>
        </div>
        <span class="note-order">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="note-arrow">↗</span>
      </button>
    </div>
  </section>
</template>
